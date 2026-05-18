import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Pin, PinOff, MessageSquare, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Category { id: string; name: string; slug: string; description: string | null; display_order: number; }
interface Post { id: string; category_id: string; author_id: string; title: string; body: string; is_pinned: boolean; created_at: string; }
interface Profile { id: string; full_name: string | null; }

export default function ForumModerationPage() {
  const queryClient = useQueryClient();
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', display_order: 0 });

  const { data: categories = [] } = useQuery({
    queryKey: ['forum-categories-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('forum_categories').select('*').order('display_order');
      if (error) throw error;
      return (data || []) as unknown as Category[];
    },
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['forum-posts-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return (data || []) as unknown as Post[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['forum-profiles-admin'],
    queryFn: async () => {
      const ids = [...new Set(posts.map(p => p.author_id))];
      if (ids.length === 0) return [];
      const { data, error } = await supabase.from('profiles').select('id, full_name').in('id', ids);
      if (error) throw error;
      return (data || []) as Profile[];
    },
    enabled: posts.length > 0,
  });

  const profileMap = new Map(profiles.map(p => [p.id, p.full_name || 'Anonymous']));
  const getName = (id: string) => profileMap.get(id) || id.slice(0, 8);
  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || ', ';

  const saveCatMutation = useMutation({
    mutationFn: async () => {
      const payload = { name: catForm.name, slug: catForm.slug || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: catForm.description || null, display_order: catForm.display_order };
      if (editingCat) {
        const { error } = await supabase.from('forum_categories').update(payload).eq('id', editingCat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('forum_categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-categories-admin'] });
      setCatSheetOpen(false);
      toast({ title: editingCat ? 'Category updated' : 'Category created' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteCatMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('forum_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forum-categories-admin'] }); toast({ title: 'Category deleted' }); },
  });

  const togglePinMutation = useMutation({
    mutationFn: async (post: Post) => {
      const { error } = await supabase.from('forum_posts').update({ is_pinned: !post.is_pinned }).eq('id', post.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forum-posts-admin'] }); },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('forum_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forum-posts-admin'] }); toast({ title: 'Post deleted' }); },
  });

  const openNewCat = () => {
    setEditingCat(null);
    setCatForm({ name: '', slug: '', description: '', display_order: categories.length });
    setCatSheetOpen(true);
  };

  const openEditCat = (c: Category) => {
    setEditingCat(c);
    setCatForm({ name: c.name, slug: c.slug, description: c.description || '', display_order: c.display_order });
    setCatSheetOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Forum Moderation</h1>
        <p className="text-muted-foreground text-sm">Manage categories, pin or remove posts</p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories"><FolderOpen className="h-4 w-4 mr-1" />Categories</TabsTrigger>
          <TabsTrigger value="posts"><MessageSquare className="h-4 w-4 mr-1" />Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openNewCat}><Plus className="h-4 w-4 mr-1" />Add Category</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No categories</TableCell></TableRow>
                  ) : categories.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="text-muted-foreground">{c.display_order}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{c.slug}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{c.description || ', '}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditCat(c)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCatMutation.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Pinned</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No posts</TableCell></TableRow>
                  ) : posts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{getCatName(post.category_id)}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getName(post.author_id)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(post.created_at), 'MMM d')}</TableCell>
                      <TableCell>
                        {post.is_pinned ? <Badge variant="default" className="text-xs">Pinned</Badge> : <span className="text-muted-foreground text-xs">, </span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => togglePinMutation.mutate(post)} title={post.is_pinned ? 'Unpin' : 'Pin'}>
                            {post.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deletePostMutation.mutate(post.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={catSheetOpen} onOpenChange={setCatSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>{editingCat ? 'Edit Category' : 'New Category'}</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Name</Label><Input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Slug</Label><Input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" /></div>
            <div><Label>Description</Label><Textarea value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div><Label>Display Order</Label><Input type="number" value={catForm.display_order} onChange={e => setCatForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} /></div>
            <Button className="w-full" onClick={() => saveCatMutation.mutate()} disabled={!catForm.name.trim() || saveCatMutation.isPending}>
              {editingCat ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
