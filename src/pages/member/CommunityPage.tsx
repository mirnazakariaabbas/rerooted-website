import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Plus, ArrowLeft, Pin, Clock, Send } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Category { id: string; name: string; slug: string; description: string | null; icon: string; display_order: number; }
interface Post { id: string; category_id: string; author_id: string; title: string; body: string; is_pinned: boolean; created_at: string; }
interface Reply { id: string; post_id: string; author_id: string; body: string; created_at: string; }
interface Profile { id: string; full_name: string | null; }

export default function CommunityPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '' });
  const [replyText, setReplyText] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('forum_categories').select('*').order('display_order');
      if (error) throw error;
      return (data || []) as unknown as Category[];
    },
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['forum-posts', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Post[];
    },
    enabled: !!selectedCategory,
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['forum-replies', selectedPost],
    queryFn: async () => {
      if (!selectedPost) return [];
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', selectedPost)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as Reply[];
    },
    enabled: !!selectedPost,
  });

  // Get all author profiles
  const authorIds = [...new Set([...posts.map(p => p.author_id), ...replies.map(r => r.author_id)])];
  const { data: profiles = [] } = useQuery({
    queryKey: ['forum-profiles', authorIds.join(',')],
    queryFn: async () => {
      if (authorIds.length === 0) return [];
      const { data, error } = await supabase.from('profiles').select('id, full_name').in('id', authorIds);
      if (error) throw error;
      return (data || []) as Profile[];
    },
    enabled: authorIds.length > 0,
  });

  const profileMap = new Map(profiles.map(p => [p.id, p.full_name || 'Anonymous']));
  const getName = (id: string) => profileMap.get(id) || 'Anonymous';
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Post counts per category
  const { data: postCounts = {} } = useQuery({
    queryKey: ['forum-post-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('forum_posts').select('category_id');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((p: { category_id: string }) => { counts[p.category_id] = (counts[p.category_id] || 0) + 1; });
      return counts;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('forum_posts').insert({
        category_id: selectedCategory!,
        author_id: user!.id,
        title: postForm.title,
        body: postForm.body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-post-counts'] });
      setNewPostOpen(false);
      setPostForm({ title: '', body: '' });
      toast({ title: 'Post created' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const createReplyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('forum_replies').insert({
        post_id: selectedPost!,
        author_id: user!.id,
        body: replyText,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies'] });
      setReplyText('');
      toast({ title: 'Reply posted' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const currentPost = posts.find(p => p.id === selectedPost);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  // View: Post detail with replies
  if (selectedPost && currentPost) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to {currentCategory?.name || 'posts'}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9 mt-0.5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(getName(currentPost.author_id))}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {currentPost.is_pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                  <CardTitle className="text-lg">{currentPost.title}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getName(currentPost.author_id)} · {format(new Date(currentPost.created_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{currentPost.body}</div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-sm">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h3>
          {replies.map(reply => (
            <Card key={reply.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-7 w-7 mt-0.5">
                    <AvatarFallback className="text-[10px] bg-accent text-accent-foreground">{getInitials(getName(reply.author_id))}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{getName(reply.author_id)}</span>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(reply.created_at), 'MMM d, HH:mm')}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{reply.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <Textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                rows={3}
              />
              <Button
                size="sm"
                className="mt-3"
                onClick={() => createReplyMutation.mutate()}
                disabled={!replyText.trim() || createReplyMutation.isPending}
              >
                <Send className="h-4 w-4 mr-1" />Reply
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  // View: Posts list for a category
  if (selectedCategory) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentCategory?.name}</h1>
              {currentCategory?.description && <p className="text-muted-foreground text-sm">{currentCategory.description}</p>}
            </div>
          </div>
          <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Post</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Post</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Title</Label><Input value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><Label>Body</Label><Textarea value={postForm.body} onChange={e => setPostForm(f => ({ ...f, body: e.target.value }))} rows={6} /></div>
                <Button onClick={() => createPostMutation.mutate()} disabled={!postForm.title.trim() || createPostMutation.isPending} className="w-full">
                  Post Discussion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No discussions yet. Start the first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <Card
                key={post.id}
                className="cursor-pointer hover:shadow-sm transition-shadow border-border/50 hover:border-primary/20"
                onClick={() => setSelectedPost(post.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(getName(post.author_id))}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {post.is_pinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                      <span className="font-medium text-sm text-foreground truncate">{post.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getName(post.author_id)} · {format(new Date(post.created_at), 'MMM d')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {format(new Date(post.created_at), 'HH:mm')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // View: Category list
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground text-sm">Connect with fellow members in topic-based discussions</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No discussion categories available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="cursor-pointer hover:shadow-md transition-all border-border/50 hover:border-primary/20"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{cat.name}</h3>
                        {cat.description && <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(postCounts as Record<string, number>)[cat.id] || 0} posts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
