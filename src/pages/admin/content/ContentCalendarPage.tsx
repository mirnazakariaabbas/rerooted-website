import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, Edit2, Trash2, FileText, Share2, Video, Image } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { PageHeader } from '@/components/layout/PageHeader';

const contentTypes = [
  { value: 'blog_post', label: 'Blog Post', icon: FileText },
  { value: 'social_media', label: 'Social Media', icon: Share2 },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'infographic', label: 'Infographic', icon: Image },
  { value: 'newsletter', label: 'Newsletter', icon: FileText },
];

const statuses = [
  { value: 'idea', label: 'Idea', color: 'bg-muted text-muted-foreground' },
  { value: 'drafting', label: 'Drafting', color: 'bg-warning/20 text-warning' },
  { value: 'review', label: 'In Review', color: 'bg-primary/20 text-primary' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-secondary/20 text-secondary' },
  { value: 'published', label: 'Published', color: 'bg-secondary text-secondary-foreground' },
];

type CalendarItem = {
  id: string;
  title: string;
  content_type: string;
  description: string | null;
  scheduled_date: string | null;
  status: string;
  notes: string | null;
  tags: any;
  created_at: string;
};

export default function ContentCalendarPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarItem | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({ title: '', content_type: 'blog_post', description: '', scheduled_date: '', status: 'idea', notes: '' });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['content-calendar'],
    queryFn: async () => {
      const { data, error } = await supabase.from('content_calendar').select('*').order('scheduled_date', { ascending: true });
      if (error) throw error;
      return data as CalendarItem[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, scheduled_date: form.scheduled_date || null };
      if (editing) {
        const { error } = await supabase.from('content_calendar').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('content_calendar').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content-calendar'] });
      toast({ title: editing ? 'Updated' : 'Created', description: 'Content item saved.' });
      setDialogOpen(false);
      setEditing(null);
      setForm({ title: '', content_type: 'blog_post', description: '', scheduled_date: '', status: 'idea', notes: '' });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('content_calendar').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content-calendar'] });
      toast({ title: 'Deleted' });
    },
  });

  const openEdit = (item: CalendarItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      content_type: item.content_type,
      description: item.description || '',
      scheduled_date: item.scheduled_date || '',
      status: item.status,
      notes: item.notes || '',
    });
    setDialogOpen(true);
  };

  const openNew = (date?: string) => {
    setEditing(null);
    setForm({ title: '', content_type: 'blog_post', description: '', scheduled_date: date || '', status: 'idea', notes: '' });
    setDialogOpen(true);
  };

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusInfo = (status: string) => statuses.find(s => s.value === status) || statuses[0];
  const getTypeIcon = (type: string) => {
    const ct = contentTypes.find(t => t.value === type);
    return ct ? ct.icon : FileText;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <PageHeader title="Content Calendar" subtitle="Plan and schedule your content pipeline" />
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative space-y-6">
      <div className="flex justify-end"><Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openNew()}><Plus className="h-4 w-4 mr-1.5" /> Add Content</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Edit Content' : 'New Content Item'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.content_type} onValueChange={v => setForm(f => ({ ...f, content_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select></div>
              <Input type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
              <Textarea placeholder="Internal notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
              <Button className="w-full" onClick={() => save.mutate()} disabled={!form.title || save.isPending}>
                {save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}>←</Button>
          <CardTitle className="text-base">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}>→</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {/* Leading empty cells */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-background p-2 min-h-[80px]" />
            ))}
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayItems = items.filter(it => it.scheduled_date && isSameDay(parseISO(it.scheduled_date), day));
              return (
                <div
                  key={dateStr}
                  className="bg-background p-1.5 min-h-[80px] cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => openNew(dateStr)}
                >
                  <div className="text-xs text-muted-foreground mb-1">{format(day, 'd')}</div>
                  {dayItems.slice(0, 2).map(it => {
                    const s = getStatusInfo(it.status);
                    return (
                      <div
                        key={it.id}
                        className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer ${s.color}`}
                        onClick={e => { e.stopPropagation(); openEdit(it); }}
                      >
                        {it.title}
                      </div>
                    );
                  })}
                  {dayItems.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayItems.length - 2} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kanban-style status columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.map(st => {
          const col = items.filter(it => it.status === st.value);
          return (
            <Card key={st.value}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge className={st.color}>{st.label}</Badge>
                  <span className="text-muted-foreground text-xs">{col.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {col.map(it => {
                  const Icon = getTypeIcon(it.content_type);
                  return (
                    <div key={it.id} className="p-2 rounded-lg border border-border bg-muted/30 group">
                      <div className="flex items-start gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{it.title}</p>
                          {it.scheduled_date && (
                            <p className="text-[10px] text-muted-foreground">{format(parseISO(it.scheduled_date), 'MMM d')}</p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(it)} className="text-muted-foreground hover:text-foreground"><Edit2 className="h-3 w-3" /></button>
                          <button onClick={() => remove.mutate(it.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {col.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No items</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
          </div>
    </motion.div>
  );
}
