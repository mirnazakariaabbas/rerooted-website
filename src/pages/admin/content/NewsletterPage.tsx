import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, FileText, Eye, Copy, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/PageHeader';

type Newsletter = {
  id: string;
  subject: string;
  body_html: string;
  from_name: string;
  reply_to: string;
  recipient_segment: string;
  status: string;
  sent_at: string | null;
  scheduled_at: string | null;
  open_count: number;
  click_count: number;
  unsubscribe_count: number;
  recipient_count: number;
  created_at: string;
};

const emptyDraft = {
  subject: '',
  body_html: '',
  from_name: 'Re-Rooted®',
  reply_to: 'hello@re-rooted.com',
  recipient_segment: 'all_subscribers',
};

const NewsletterPage = () => {
  const { user: authUser } = useAuth();
  const [tab, setTab] = useState('compose');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const fetchNewsletters = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNewsletters(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchNewsletters(); }, []);

  const handleSaveDraft = async () => {
    if (!draft.subject.trim()) { toast.error('Subject is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('newsletters').insert({
      ...draft,
      status: 'draft',
      created_by: authUser?.id,
    });
    if (error) { toast.error('Failed to save'); setSaving(false); return; }
    toast.success('Draft saved');
    setDraft(emptyDraft);
    setSaving(false);
    fetchNewsletters();
    setTab('archive');
  };

  const handleDuplicate = async (nl: Newsletter) => {
    const { error } = await supabase.from('newsletters').insert({
      subject: `Copy of ${nl.subject}`,
      body_html: nl.body_html,
      from_name: nl.from_name,
      reply_to: nl.reply_to,
      recipient_segment: nl.recipient_segment,
      status: 'draft',
      created_by: authUser?.id,
    });
    if (error) { toast.error('Failed to duplicate'); return; }
    toast.success('Newsletter duplicated as draft');
    fetchNewsletters();
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      scheduled: 'bg-warning/15 text-warning',
      sent: 'bg-success/15 text-success',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="Newsletter" subtitle="Compose and manage email newsletters" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject Line</label>
                <Input
                  placeholder="Newsletter subject..."
                  value={draft.subject}
                  onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">From Name</label>
                  <Input value={draft.from_name} onChange={e => setDraft(d => ({ ...d, from_name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Reply-To</label>
                  <Input value={draft.reply_to} onChange={e => setDraft(d => ({ ...d, reply_to: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Recipients</label>
                <Select value={draft.recipient_segment} onValueChange={v => setDraft(d => ({ ...d, recipient_segment: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_subscribers">All Subscribers</SelectItem>
                    <SelectItem value="active_members">Active Members</SelectItem>
                    <SelectItem value="pre_rooted">Pre-Rooted Stage</SelectItem>
                    <SelectItem value="rooting_in">Rooting In Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Body (HTML)</label>
                <Textarea
                  placeholder="Write your newsletter content here... HTML is supported."
                  value={draft.body_html}
                  onChange={e => setDraft(d => ({ ...d, body_html: e.target.value }))}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveDraft} disabled={saving || !draft.subject.trim()}>
                  <FileText className="h-4 w-4 mr-1" /> Save as Draft
                </Button>
                <Button variant="outline" disabled>
                  <Send className="h-4 w-4 mr-1" /> Send Now
                  <Badge variant="outline" className="ml-2 text-[10px]">Phase 3</Badge>
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-muted-foreground">Preview</label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    className="text-xs h-7"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    Desktop
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    className="text-xs h-7"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    Mobile
                  </Button>
                </div>
              </div>
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  <div
                    className={`p-6 mx-auto ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}
                  >
                    <div className="border-b pb-3 mb-4">
                      <p className="text-xs text-muted-foreground">From: {draft.from_name}</p>
                      <p className="text-sm font-semibold">{draft.subject || '(No subject)'}</p>
                    </div>
                    {draft.body_html ? (
                      <div
                        className="prose prose-sm max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: draft.body_html }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-12">
                        Start writing to see a preview
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="archive">
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Recipients</TableHead>
                  <TableHead className="font-semibold">Opens</TableHead>
                  <TableHead className="font-semibold">Clicks</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
                ) : newsletters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-muted-foreground">No newsletters yet</p>
                        <Button size="sm" onClick={() => setTab('compose')}>
                          <Plus className="h-4 w-4 mr-1" /> Create First Newsletter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  newsletters.map(nl => (
                    <TableRow key={nl.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">{nl.subject}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs capitalize ${statusBadge(nl.status)}`}>{nl.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{nl.recipient_count || '—'}</TableCell>
                      <TableCell className="text-sm">{nl.open_count}</TableCell>
                      <TableCell className="text-sm">{nl.click_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(nl.sent_at || nl.created_at), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDuplicate(nl)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
          </div>
    </motion.div>
  );
};

export default NewsletterPage;
