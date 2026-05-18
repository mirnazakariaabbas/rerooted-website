import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Booking = {
  id: string;
  user_id: string;
  coach_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  profiles: { full_name: string | null } | null;
  coaches: { name: string } | null;
};

const BookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('meeting_bookings')
      .select('*, profiles(full_name), coaches(name)')
      .order('scheduled_at', { ascending: false });
    if (data) setBookings(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('meeting_bookings').update({ status }).eq('id', id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Status updated');
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const statusColor = (s: string) => {
    if (s === 'completed') return 'default';
    if (s === 'cancelled') return 'destructive';
    return 'secondary';
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading bookings...</p>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(b => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.profiles?.full_name || ', '}</TableCell>
              <TableCell>{b.coaches?.name || ', '}</TableCell>
              <TableCell className="text-sm">{format(new Date(b.scheduled_at), 'MMM d, yyyy HH:mm')}</TableCell>
              <TableCell className="text-sm">{b.duration_minutes}m</TableCell>
              <TableCell><Badge variant={statusColor(b.status)} className="text-xs">{b.status}</Badge></TableCell>
              <TableCell>
                <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No bookings yet</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTab;
