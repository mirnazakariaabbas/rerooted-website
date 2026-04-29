import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, UsersRound, GraduationCap, Mail, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

function MetricCard({ icon: Icon, label, value, change }: { icon: React.ElementType; label: string; value: number | string; change?: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
            {change && <p className="text-xs text-muted-foreground mt-1">{change}</p>}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [contactCount, setContactCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [coachCount, setCoachCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const [contacts, members, coaches, pending, submissions] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('coaches').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('approval_status', 'pending'),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      ]);
      setContactCount(contacts.count || 0);
      setMemberCount(members.count || 0);
      setCoachCount(coaches.count || 0);
      setPendingCount(pending.count || 0);
      setSubmissionCount(submissions.count || 0);
    };
    fetchCounts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-1">Overview of your Re-Rooted® platform activity</p>
      </div>

      {/* Primary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Users} label="Total Contacts" value={contactCount} />
        <MetricCard icon={UsersRound} label="Total Members" value={memberCount} />
        <MetricCard icon={GraduationCap} label="Active Coaches" value={coachCount} />
        <MetricCard icon={Mail} label="Emails Sent" value="—" change="Coming in Phase 2" />
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-display font-bold">{pendingCount}</p>
            <Button
              variant="link"
              className="px-0 text-sm text-primary"
              onClick={() => navigate('/app/admin/users/members')}
            >
              Review →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-secondary" />
              New Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-display font-bold">{submissionCount}</p>
            <Button
              variant="link"
              className="px-0 text-sm text-primary"
              onClick={() => navigate('/app/admin/users/contacts')}
            >
              View All →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="outline" className="text-xs">RSS</Badge>
              Latest Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">RSS monitoring coming in Phase 3</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/app/admin/users/contacts')} className="bg-primary text-primary-foreground">
          + Add Contact
        </Button>
        <Button variant="outline" onClick={() => navigate('/app/admin/users/members')}>
          View Pending Approvals
        </Button>
        <Button variant="outline" onClick={() => navigate('/app/admin/content/emails')}>
          Manage Email Templates
        </Button>
      </div>
    </motion.div>
  );
};

export default AdminHome;
