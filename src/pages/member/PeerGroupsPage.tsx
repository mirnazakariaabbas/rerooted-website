import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Users, UserPlus, UserMinus, Globe, MapPin, Heart, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { motion } from 'framer-motion';

interface PeerGroup { id: string; name: string; description: string | null; group_type: string; created_at: string; }
interface Membership { id: string; group_id: string; user_id: string; joined_at: string; }
interface Profile { id: string; full_name: string | null; }

const typeIcons: Record<string, React.ElementType> = {
  country: Globe, stage: MapPin, family: Heart, interest: Sparkles, general: Users,
};

export default function PeerGroupsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: groups = [] } = useQuery({
    queryKey: ['peer-groups'],
    queryFn: async () => { const { data, error } = await supabase.from('peer_groups').select('*').order('name'); if (error) throw error; return (data || []) as unknown as PeerGroup[]; },
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ['my-group-memberships', user?.id],
    queryFn: async () => { if (!user?.id) return []; const { data, error } = await supabase.from('peer_group_members').select('*').eq('user_id', user.id); if (error) throw error; return (data || []) as unknown as Membership[]; },
    enabled: !!user?.id,
  });

  const joinedGroupIds = myMemberships.map(m => m.group_id);
  const { data: peerMembers = [] } = useQuery({
    queryKey: ['peer-group-peers', joinedGroupIds.join(',')],
    queryFn: async () => { if (joinedGroupIds.length === 0) return []; const { data, error } = await supabase.from('peer_group_members').select('*').in('group_id', joinedGroupIds); if (error) throw error; return (data || []) as unknown as Membership[]; },
    enabled: joinedGroupIds.length > 0,
  });

  const peerUserIds = [...new Set(peerMembers.map(m => m.user_id).filter(id => id !== user?.id))];
  const { data: peerProfiles = [] } = useQuery({
    queryKey: ['peer-profiles', peerUserIds.join(',')],
    queryFn: async () => { if (peerUserIds.length === 0) return []; const { data, error } = await supabase.from('profiles').select('id, full_name').in('id', peerUserIds); if (error) throw error; return (data || []) as Profile[]; },
    enabled: peerUserIds.length > 0,
  });

  const profileMap = new Map(peerProfiles.map(p => [p.id, p.full_name || 'Member']));

  const joinMutation = useMutation({
    mutationFn: async (groupId: string) => { const { error } = await supabase.from('peer_group_members').insert({ group_id: groupId, user_id: user!.id }); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-group-memberships'] }); queryClient.invalidateQueries({ queryKey: ['peer-group-peers'] }); toast({ title: 'Joined group!' }); },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const leaveMutation = useMutation({
    mutationFn: async (groupId: string) => { const { error } = await supabase.from('peer_group_members').delete().eq('group_id', groupId).eq('user_id', user!.id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-group-memberships'] }); queryClient.invalidateQueries({ queryKey: ['peer-group-peers'] }); toast({ title: 'Left group' }); },
  });

  const isMember = (groupId: string) => myMemberships.some(m => m.group_id === groupId);
  const getMemberCount = (groupId: string) => peerMembers.filter(m => m.group_id === groupId).length;
  const getGroupPeers = (groupId: string) => peerMembers.filter(m => m.group_id === groupId && m.user_id !== user?.id);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <PageHeader
        title="Peer Groups"
        subtitle="Connect with members who share your experience"
      />
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative space-y-6">

      {groups.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No groups available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {groups.map((group, i) => {
            const joined = isMember(group.id);
            const Icon = typeIcons[group.group_type] || Users;
            const peers = getGroupPeers(group.id);
            return (
              <motion.div key={group.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`border border-border transition-all ${joined ? 'border-primary/30' : ''}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${joined ? 'bg-primary/15' : 'bg-muted'}`}>
                          <Icon className={`h-5 w-5 ${joined ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{group.name}</h3>
                          <Badge variant="outline" className="text-[10px] capitalize">{group.group_type}</Badge>
                        </div>
                      </div>
                      {joined && <Badge variant="default" className="text-[10px]">Joined</Badge>}
                    </div>
                    {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
                    {joined && peers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Members ({getMemberCount(group.id)})</p>
                        <div className="flex flex-wrap gap-2">
                          {peers.slice(0, 6).map(peer => (
                            <div key={peer.id} className="flex items-center gap-1.5">
                              <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px] bg-accent text-accent-foreground">{(profileMap.get(peer.user_id) || 'M').charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                              <span className="text-xs text-foreground">{profileMap.get(peer.user_id) || 'Member'}</span>
                            </div>
                          ))}
                          {peers.length > 6 && <span className="text-xs text-muted-foreground">+{peers.length - 6} more</span>}
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant={joined ? 'outline' : 'default'}
                      className="w-full rounded-full"
                      onClick={() => joined ? leaveMutation.mutate(group.id) : joinMutation.mutate(group.id)}
                      disabled={joinMutation.isPending || leaveMutation.isPending}
                    >
                      {joined ? <><UserMinus className="h-4 w-4 mr-1" />Leave Group</> : <><UserPlus className="h-4 w-4 mr-1" />Join Group</>}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </motion.div>
  );
}
