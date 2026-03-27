import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import BottomNav from '@/components/layout/BottomNav';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PendingApproval = () => {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6">
        <Clock className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-2xl font-serif font-bold text-foreground">Account Pending Approval</h1>
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

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (approvalStatus !== 'approved') {
    return <PendingApproval />;
  }

  if (!user.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <BottomNav />
    </div>
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
