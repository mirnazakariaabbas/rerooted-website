import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useCoachRole } from '@/hooks/useCoachRole';
import { UserProvider, useUser } from '@/contexts/UserContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PendingApproval = () => {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6">
        <Clock className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-2xl font-display font-bold text-foreground">Account Pending Approval</h1>
        <p className="text-muted-foreground">
          Your account is being reviewed by an administrator. You'll receive access once approved.
        </p>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );
};

const MemberContent = () => {
  const { user, profileLoading, approvalStatus } = useUser();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { isCoach, loading: coachLoading } = useCoachRole();
  const location = useLocation();

  if (profileLoading || adminLoading || coachLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Block non-admins from admin routes
  if (!isAdmin && location.pathname.startsWith('/app/admin')) {
    return <Navigate to="/app/home" replace />;
  }

  // Block non-coaches from coach dashboard
  if (!isCoach && location.pathname.startsWith('/app/coach-dashboard')) {
    return <Navigate to="/app/home" replace />;
  }

  // Admin and coach users skip the approval gate
  if (!isAdmin && !isCoach && approvalStatus !== 'approved') {
    return <PendingApproval />;
  }

  if (!isAdmin && !isCoach && !user.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <OnboardingTour />
    </SidebarProvider>
  );
};

const MemberLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <UserProvider>
      <MemberContent />
    </UserProvider>
  );
};

export default MemberLayout;
