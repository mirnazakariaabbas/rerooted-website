import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useCoachRole } from '@/hooks/useCoachRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Users, BookOpen, Calendar, Clock, UserCircle, Plus, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CoachDashboard = () => {
  const { isCoach, coachId, loading: roleLoading } = useCoachRole();

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isCoach || !coachId) {
    return <Navigate to="/app/home" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-black tracking-tight mb-8">Coach Dashboard</h1>
      <Tabs defaultValue="coachees">
        <TabsList className="w-full flex overflow-x-auto mb-6">
          <TabsTrigger value="coachees" className="flex-1 text-xs gap-1"><Users className="h-4 w-4" />Coachees</TabsTrigger>
          <TabsTrigger value="journal" className="flex-1 text-xs gap-1"><BookOpen className="h-4 w-4" />Journal</TabsTrigger>
          <TabsTrigger value="availability" className="flex-1 text-xs gap-1"><Calendar className="h-4 w-4" />Availability</TabsTrigger>
          <TabsTrigger value="sessions" className="flex-1 text-xs gap-1"><Clock className="h-4 w-4" />Sessions</TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 text-xs gap-1"><UserCircle className="h-4 w-4" />Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="coachees"><CoacheesTab coachId={coachId} /></TabsContent>
        <TabsContent value="journal"><JournalTab coachId={coachId} /></TabsContent>
        <TabsContent value="availability"><AvailabilityTab coachId={coachId} /></TabsContent>
        <TabsContent value="sessions"><SessionsTab coachId={coachId} /></TabsContent>
        <TabsContent value="profile"><ProfileTab coachId={coachId} /></TabsContent>
      </Tabs>
    </motion.div>
  );
};

/* ─── Coachees Tab ─── */
const CoacheesTab = ({ coachId }: { coachId: string }) => {
  const [coachees, setCoachees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: assignments } = await supabase
        .from('coach_assignments')
        .select('user_id')
        .eq('coach_id', coachId);

      if (assignments && assignments.length > 0) {
        const userIds = assignments.map(a => a.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, country_from, country_to, stage')
          .in('id', userIds);

        // Get latest assessment scores
        const { data: assessments } = await supabase
          .from('assessments')
          .select('user_id, score, completed_at')
          .in('user_id', userIds)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false });

        const scoreMap: Record<string, number> = {};
        assessments?.forEach(a => {
          if (!scoreMap[a.user_id] && a.score != null) scoreMap[a.user_id] = a.score;
        });

        setCoachees((profiles || []).map(p => ({ ...p, score: scoreMap[p.id] ?? null })));
      }
      setLoading(false);
    };
    fetch();
  }, [coachId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading coachees...</p>;

  if (coachees.length === 0) {
    return (
      <Card className="border border-border"><CardContent className="py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground">No coachees assigned yet.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>From → To</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coachees.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.full_name || '—'}</TableCell>
              <TableCell className="text-sm">{c.country_from || '?'} → {c.country_to || '?'}</TableCell>
              <TableCell><Badge variant="secondary" className="text-xs">{c.stage || '—'}</Badge></TableCell>
              <TableCell className="text-sm">{c.score != null ? `${c.score}%` : '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/* ─── Journal Tab ─── */
const JournalTab = ({ coachId }: { coachId: string }) => {
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: assignments } = await supabase
        .from('coach_assignments')
        .select('user_id')
        .eq('coach_id', coachId);

      if (assignments && assignments.length > 0) {
        const userIds = assignments.map(a => a.user_id);
        const { data } = await supabase
          .from('reflections')
          .select('*')
          .in('user_id', userIds)
          .eq('shared_with_coach', true)
          .order('created_at', { ascending: false })
          .limit(50);

        // Get profile names
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const nameMap: Record<string, string> = {};
        profiles?.forEach(p => { nameMap[p.id] = p.full_name || 'Unknown'; });

        setReflections((data || []).map(r => ({ ...r, coachee_name: nameMap[r.user_id] || 'Unknown' })));
      }
      setLoading(false);
    };
    fetch();
  }, [coachId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading journal entries...</p>;

  if (reflections.length === 0) {
    return (
      <Card className="border border-border"><CardContent className="py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground">No shared journal entries yet.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-4">
      {reflections.map(r => (
        <Card key={r.id} className="border border-border">
          <CardContent className="py-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold">{r.coachee_name}</p>
              <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm font-medium text-primary mb-1">{r.prompt}</p>
            <p className="text-sm text-foreground/80">{r.response || '—'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* ─── Availability Tab ─── */
const AvailabilityTab = ({ coachId }: { coachId: string }) => {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDay, setNewDay] = useState('1');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');

  const fetchSlots = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('coach_availability')
      .select('*')
      .eq('coach_id', coachId)
      .order('day_of_week')
      .order('start_time');
    setSlots(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, [coachId]);

  const addSlot = async () => {
    const { error } = await supabase.from('coach_availability').insert({
      coach_id: coachId,
      day_of_week: parseInt(newDay),
      start_time: newStart,
      end_time: newEnd,
    });
    if (error) { toast.error('Failed to add slot'); return; }
    toast.success('Slot added');
    fetchSlots();
  };

  const deleteSlot = async (id: string) => {
    const { error } = await supabase.from('coach_availability').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    setSlots(prev => prev.filter(s => s.id !== id));
    toast.success('Slot removed');
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading availability...</p>;

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardContent className="py-4">
          <p className="text-sm font-bold mb-3">Add Time Slot</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground">Day</label>
              <Select value={newDay} onValueChange={setNewDay}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Start</label>
              <Input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className="w-32" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End</label>
              <Input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="w-32" />
            </div>
            <Button size="sm" onClick={addSlot}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </CardContent>
      </Card>

      {slots.length === 0 ? (
        <Card className="border border-border"><CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No availability set yet.</p>
        </CardContent></Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{DAYS[s.day_of_week]}</TableCell>
                  <TableCell>{s.start_time?.slice(0, 5)}</TableCell>
                  <TableCell>{s.end_time?.slice(0, 5)}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteSlot(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

/* ─── Sessions Tab ─── */
const SessionsTab = ({ coachId }: { coachId: string }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('meeting_bookings')
        .select('*')
        .eq('coach_id', coachId)
        .order('scheduled_at', { ascending: true });

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(b => b.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const nameMap: Record<string, string> = {};
        profiles?.forEach(p => { nameMap[p.id] = p.full_name || 'Unknown'; });

        setBookings(data.map(b => ({ ...b, member_name: nameMap[b.user_id] || 'Unknown' })));
      }
      setLoading(false);
    };
    fetch();
  }, [coachId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading sessions...</p>;

  if (bookings.length === 0) {
    return (
      <Card className="border border-border"><CardContent className="py-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground">No sessions scheduled yet.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(b => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.member_name}</TableCell>
              <TableCell className="text-sm">{new Date(b.scheduled_at).toLocaleString()}</TableCell>
              <TableCell className="text-sm">{b.duration_minutes} min</TableCell>
              <TableCell><Badge variant="secondary" className="text-xs">{b.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/* ─── Profile Tab ─── */
const ProfileTab = ({ coachId }: { coachId: string }) => {
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', specialties: '', certification_level: 'non-certified', photo_url: '' });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('coaches').select('*').eq('id', coachId).single();
      if (data) {
        setCoach(data);
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          specialties: Array.isArray(data.specialties) ? (data.specialties as string[]).join(', ') : '',
          certification_level: (data as any).certification_level || 'non-certified',
          photo_url: data.photo_url || '',
        });
      }
      setLoading(false);
    };
    fetch();
  }, [coachId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('coaches').update({
      name: form.name,
      bio: form.bio || null,
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()) : [],
      certification_level: form.certification_level,
      photo_url: form.photo_url || null,
    } as any).eq('id', coachId);
    setSaving(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Profile updated');
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading profile...</p>;

  return (
    <Card className="border border-border">
      <CardContent className="py-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Photo URL</label>
          <Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Certification Level</label>
          <Select value={form.certification_level} onValueChange={v => setForm(f => ({ ...f, certification_level: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACC">ACC</SelectItem>
              <SelectItem value="PCC">PCC</SelectItem>
              <SelectItem value="MCC">MCC</SelectItem>
              <SelectItem value="non-certified">Non-certified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Specialties (comma-separated)</label>
          <Input value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Bio</label>
          <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} />
        </div>
        <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachDashboard;
