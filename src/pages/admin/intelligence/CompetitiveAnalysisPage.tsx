import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, RefreshCw, Globe, Shield, Lightbulb, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';

type Competitor = {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  analysis: any;
  last_analyzed_at: string | null;
  created_at: string;
};

export default function CompetitiveAnalysisPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const qc = useQueryClient();

  const { data: competitors = [], isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('competitors').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Competitor[];
    },
  });

  const selectedComp = competitors.find(c => c.id === selected);

  const addCompetitor = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from('competitors').insert({ name: newName, website: newWebsite || null });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitors'] });
      setAddOpen(false);
      setNewName('');
      setNewWebsite('');
      toast.success('Competitor added');
    },
    onError: () => toast.error('Failed to add competitor'),
  });

  const [analyzing, setAnalyzing] = useState(false);
  const runAnalysis = async (comp: Competitor) => {
    if (!comp.website) { toast.error('No website URL to analyze'); return; }
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-competitor', {
        body: { competitorId: comp.id, website: comp.website, name: comp.name },
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ['competitors'] });
      toast.success('Analysis complete');
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const analysis = selectedComp?.analysis || {};
  const swot = analysis.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const threatLevel = analysis.threat_level || 'Unknown';
  const recs = analysis.recommendations || [];
  const intel = analysis.intelligence || {};

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <PageHeader title="Competitive Analysis" subtitle="AI-powered competitive intelligence" />
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Left panel - Competitors list */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tracked Competitors</CardTitle>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Competitor</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div><Label>Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Company name" /></div>
                    <div><Label>Website</Label><Input value={newWebsite} onChange={e => setNewWebsite(e.target.value)} placeholder="https://..." /></div>
                    <Button onClick={() => addCompetitor.mutate()} disabled={!newName.trim()} className="w-full">Add Competitor</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
            ) : competitors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No competitors tracked yet</p>
            ) : (
              competitors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    selected === c.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  {c.website && <p className="text-xs text-muted-foreground truncate">{c.website}</p>}
                  {c.last_analyzed_at && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Analyzed {new Date(c.last_analyzed_at).toLocaleDateString()}
                    </p>
                  )}
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right panel - Analysis */}
        <div className="space-y-6">
          {!selectedComp ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Select a competitor to view analysis</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-black text-foreground">{selectedComp.name}</h2>
                  {selectedComp.website && <p className="text-sm text-muted-foreground">{selectedComp.website}</p>}
                </div>
                <Button onClick={() => runAnalysis(selectedComp)} disabled={analyzing} size="sm">
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${analyzing ? 'animate-spin' : ''}`} />
                  {analyzing ? 'Analyzing...' : 'Run New Analysis'}
                </Button>
              </div>

              {!selectedComp.last_analyzed_at ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-3" />
                    <p className="text-muted-foreground">No analysis yet. Click "Run New Analysis" to start.</p>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="swot">
                  <TabsList>
                    <TabsTrigger value="swot"><Shield className="h-3 w-3 mr-1" /> SWOT</TabsTrigger>
                    <TabsTrigger value="threats"><AlertTriangle className="h-3 w-3 mr-1" /> Threats</TabsTrigger>
                    <TabsTrigger value="recommendations"><Lightbulb className="h-3 w-3 mr-1" /> Recommendations</TabsTrigger>
                    <TabsTrigger value="intel"><FileText className="h-3 w-3 mr-1" /> Raw Intel</TabsTrigger>
                  </TabsList>

                  <TabsContent value="swot" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'strengths', label: 'Strengths', color: 'border-secondary bg-secondary/5' },
                        { key: 'weaknesses', label: 'Weaknesses', color: 'border-destructive bg-destructive/5' },
                        { key: 'opportunities', label: 'Opportunities', color: 'border-primary bg-primary/5' },
                        { key: 'threats', label: 'Threats', color: 'border-warning bg-warning/5' },
                      ].map(q => (
                        <Card key={q.key} className={`border-l-4 ${q.color}`}>
                          <CardHeader className="pb-2"><CardTitle className="text-sm">{q.label}</CardTitle></CardHeader>
                          <CardContent>
                            <ul className="space-y-1.5">
                              {(swot[q.key] || []).map((item: string, i: number) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                  <span className="text-muted-foreground mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                              {(swot[q.key] || []).length === 0 && <li className="text-sm text-muted-foreground">No data</li>}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="threats" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm text-muted-foreground">Threat Level:</span>
                          <Badge className={
                            threatLevel === 'High' ? 'bg-destructive text-destructive-foreground' :
                            threatLevel === 'Medium' ? 'bg-warning text-warning-foreground' :
                            'bg-secondary text-secondary-foreground'
                          }>{threatLevel}</Badge>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{analysis.threat_narrative || 'Run analysis to generate threat assessment.'}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-4">
                    <div className="space-y-3">
                      {recs.map((r: any, i: number) => (
                        <Card key={i}>
                          <CardContent className="pt-4 flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">{i + 1}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{r.text || r}</p>
                              {r.priority && <Badge className="mt-1" variant="outline">{r.priority}</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {recs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No recommendations yet</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="intel" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        {Object.keys(intel).length > 0 ? (
                          <dl className="space-y-3">
                            {Object.entries(intel).map(([k, v]) => (
                              <div key={k} className="flex items-start gap-3">
                                <dt className="text-sm font-medium text-muted-foreground w-32 shrink-0 capitalize">{k.replace(/_/g, ' ')}</dt>
                                <dd className="text-sm text-foreground">{String(v)}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-8">No raw intelligence data</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {competitors.length > 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Competitor Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Competitor</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Threat Level</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Strengths</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Last Analyzed</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map(c => {
                    const a = c.analysis || {};
                    return (
                      <tr key={c.id} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-foreground font-medium">{c.name}</td>
                        <td className="py-2.5 text-center">
                          <Badge variant="outline">{a.threat_level || '—'}</Badge>
                        </td>
                        <td className="py-2.5 text-center text-muted-foreground">{(a.swot?.strengths || []).length}</td>
                        <td className="py-2.5 text-center text-muted-foreground text-xs">
                          {c.last_analyzed_at ? new Date(c.last_analyzed_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
          </div>
    </motion.div>
  );
}
