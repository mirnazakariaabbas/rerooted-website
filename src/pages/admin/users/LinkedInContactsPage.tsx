import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Upload, ExternalLink, UserPlus, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';

type LinkedInContact = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  company: string | null;
  position: string | null;
  linkedin_url: string | null;
  connected_on: string | null;
  imported_at: string;
  converted_to_contact_id: string | null;
};

const LinkedInContactsPage = () => {
  const [contacts, setContacts] = useState<LinkedInContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchContacts = async () => {
    setLoading(true);
    const { data } = await supabase.from('linkedin_contacts').select('*').order('imported_at', { ascending: false });
    if (data) setContacts(data as LinkedInContact[]);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      toast({ title: 'Invalid CSV', description: 'File must have a header row and data', variant: 'destructive' });
      setImporting(false);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
    const fnIdx = headers.findIndex(h => h.includes('first') && h.includes('name'));
    const lnIdx = headers.findIndex(h => h.includes('last') && h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const companyIdx = headers.findIndex(h => h.includes('company'));
    const posIdx = headers.findIndex(h => h.includes('position') || h.includes('title'));
    const urlIdx = headers.findIndex(h => h.includes('url') || h.includes('profile'));
    const dateIdx = headers.findIndex(h => h.includes('connected'));

    if (fnIdx === -1) {
      toast({ title: 'Missing column', description: 'CSV must have a "First Name" column', variant: 'destructive' });
      setImporting(false);
      return;
    }

    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
      return {
        first_name: cols[fnIdx] || 'Unknown',
        last_name: lnIdx >= 0 ? cols[lnIdx] || null : null,
        email: emailIdx >= 0 ? cols[emailIdx] || null : null,
        company: companyIdx >= 0 ? cols[companyIdx] || null : null,
        position: posIdx >= 0 ? cols[posIdx] || null : null,
        linkedin_url: urlIdx >= 0 ? cols[urlIdx] || null : null,
        connected_on: dateIdx >= 0 && cols[dateIdx] ? cols[dateIdx] : null,
        imported_by: user?.id,
      };
    }).filter(r => r.first_name && r.first_name !== 'Unknown');

    if (rows.length === 0) {
      toast({ title: 'No valid rows', variant: 'destructive' });
      setImporting(false);
      return;
    }

    const { error } = await supabase.from('linkedin_contacts').insert(rows as any);
    if (error) {
      toast({ title: 'Import error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `${rows.length} contacts imported` });
      fetchContacts();
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleConvertToContact = async (lc: LinkedInContact) => {
    const { data, error } = await supabase.from('contacts').insert({
      first_name: lc.first_name,
      last_name: lc.last_name || '',
      email: lc.email,
      source: 'linkedin_import' as any,
      created_by: user?.id,
    } as any).select('id').single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      await supabase.from('linkedin_contacts').update({ converted_to_contact_id: data.id } as any).eq('id', lc.id);
      toast({ title: 'Converted to contact' });
      fetchContacts();
    }
  };

  const filtered = useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(c =>
      c.first_name.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="LinkedIn Contacts" subtitle="Import and manage LinkedIn connections" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><div>
          <input type="file" accept=".csv" ref={fileRef} className="hidden" onChange={handleCsvImport} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={importing}>
            <Upload className="h-4 w-4 mr-1" /> {importing ? 'Importing...' : 'Import CSV'}
          </Button></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Imported</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{contacts.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Linkedin className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">With Email</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{contacts.filter(c => c.email).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center"><Linkedin className="h-5 w-5 text-success" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Converted</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{contacts.filter(c => c.converted_to_contact_id).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/30 flex items-center justify-center"><UserPlus className="h-5 w-5 text-accent-foreground" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search contacts..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Position</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Connected</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <Linkedin className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No LinkedIn contacts imported</p>
                  <p className="text-xs text-muted-foreground mt-1">Export your connections from LinkedIn and import the CSV</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.first_name} {c.last_name || ''}</span>
                      {c.linkedin_url && (
                        <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.company || ', '}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.position || ', '}</TableCell>
                  <TableCell className="text-sm">{c.email || ', '}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.connected_on ? format(new Date(c.connected_on), 'dd MMM yyyy') : ', '}</TableCell>
                  <TableCell>
                    {c.converted_to_contact_id ? (
                      <Badge className="bg-success/15 text-success">Converted</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Imported</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!c.converted_to_contact_id && (
                      <Button variant="ghost" size="sm" onClick={() => handleConvertToContact(c)}>
                        <UserPlus className="h-4 w-4 mr-1" /> Convert
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
          </div>
    </motion.div>
  );
};

export default LinkedInContactsPage;
