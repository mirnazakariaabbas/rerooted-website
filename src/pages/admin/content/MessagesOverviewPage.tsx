import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
}

export default function MessagesOverviewPage() {
  const [selectedConvo, setSelectedConvo] = useState<{ id1: string; id2: string; name: string } | null>(null);

  // Get all messages (admin only via RLS)
  const { data: allMessages = [], isLoading } = useQuery({
    queryKey: ['admin-messages-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data || []) as unknown as MessageRow[];
    },
  });

  // Get profiles for names
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles-for-messages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id, full_name');
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const profileMap = new Map(profiles.map(p => [p.id, p.full_name || 'Unknown']));
  const getName = (id: string) => profileMap.get(id) || id.slice(0, 8);

  // Group into conversations (unique pairs)
  const conversations = new Map<string, { id1: string; id2: string; lastMessage: MessageRow; count: number; unread: number }>();
  allMessages.forEach(msg => {
    const key = [msg.sender_id, msg.recipient_id].sort().join('::');
    const existing = conversations.get(key);
    if (!existing) {
      conversations.set(key, {
        id1: msg.sender_id,
        id2: msg.recipient_id,
        lastMessage: msg,
        count: 1,
        unread: msg.is_read ? 0 : 1,
      });
    } else {
      existing.count++;
      if (!msg.is_read) existing.unread++;
    }
  });

  const convoList = Array.from(conversations.values()).sort(
    (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  );

  // Get thread for selected conversation
  const threadMessages = selectedConvo
    ? allMessages
        .filter(m =>
          (m.sender_id === selectedConvo.id1 && m.recipient_id === selectedConvo.id2) ||
          (m.sender_id === selectedConvo.id2 && m.recipient_id === selectedConvo.id1)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages Overview</h1>
        <p className="text-muted-foreground text-sm">Read-only view of all member-coach conversations</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participants</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Unread</TableHead>
                <TableHead className="w-16">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : convoList.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No conversations yet</TableCell></TableRow>
              ) : convoList.map(convo => (
                <TableRow key={`${convo.id1}-${convo.id2}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{getName(convo.id1)}</span>
                      <span className="text-muted-foreground text-xs">↔</span>
                      <span className="font-medium text-sm">{getName(convo.id2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                    {convo.lastMessage.content}
                  </TableCell>
                  <TableCell><Badge variant="outline">{convo.count}</Badge></TableCell>
                  <TableCell>
                    {convo.unread > 0 ? <Badge variant="default">{convo.unread}</Badge> : <span className="text-muted-foreground text-sm">0</span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedConvo({
                      id1: convo.id1, id2: convo.id2,
                      name: `${getName(convo.id1)} ↔ ${getName(convo.id2)}`
                    })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedConvo} onOpenChange={() => setSelectedConvo(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {selectedConvo?.name}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <div className="space-y-3 pr-4">
              {threadMessages.map(msg => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {getName(msg.sender_id).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground">{getName(msg.sender_id)}</span>
                    <span className="text-[10px] text-muted-foreground">{format(new Date(msg.created_at), 'MMM d, HH:mm')}</span>
                  </div>
                  <div className={cn('ml-8 rounded-lg px-3 py-2 text-sm bg-muted')}>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
