import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  quote: string;
  photo_url: string | null;
  rating: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    client_name: '', company: '', role: '', quote: '', photo_url: '', rating: 5, is_featured: false, display_order: 0,
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as Testimonial[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: typeof form & { id?: string }) => {
      const record = {
        client_name: payload.client_name,
        company: payload.company || null,
        role: payload.role || null,
        quote: payload.quote,
        photo_url: payload.photo_url || null,
        rating: payload.rating,
        is_featured: payload.is_featured,
        display_order: payload.display_order,
      };
      if (payload.id) {
        const { error } = await supabase.from('testimonials').update(record).eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert(record);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      setSheetOpen(false);
      toast({ title: editing ? 'Testimonial updated' : 'Testimonial created' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      toast({ title: 'Testimonial deleted' });
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm({ client_name: '', company: '', role: '', quote: '', photo_url: '', rating: 5, is_featured: false, display_order: testimonials.length });
    setSheetOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      client_name: t.client_name, company: t.company || '', role: t.role || '',
      quote: t.quote, photo_url: t.photo_url || '', rating: t.rating,
      is_featured: t.is_featured, display_order: t.display_order,
    });
    setSheetOpen(true);
  };

  const toggleFeatured = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_featured: !t.is_featured }).eq('id', t.id);
    queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground text-sm">Manage client testimonials displayed on the website</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Testimonial</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : testimonials.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No testimonials yet</TableCell></TableRow>
              ) : testimonials.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground"><GripVertical className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{t.client_name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.company || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.is_featured ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleFeatured(t)}>
                      {t.is_featured ? 'Featured' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? 'Edit Testimonial' : 'New Testimonial'}</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Client Name *</Label><Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
            <div><Label>Role / Title</Label><Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
            <div><Label>Quote *</Label><Textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={4} /></div>
            <div><Label>Photo URL</Label><Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} /></div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" min={0} value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
              <Label>Featured on website</Label>
            </div>
            <Button className="w-full mt-4" onClick={() => saveMutation.mutate({ ...form, id: editing?.id })} disabled={saveMutation.isPending || !form.client_name || !form.quote}>
              {editing ? 'Update' : 'Create'} Testimonial
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
