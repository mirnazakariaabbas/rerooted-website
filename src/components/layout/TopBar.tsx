import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { Moon, Sun, LogOut, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationsDrawer } from '@/components/layout/NotificationsDrawer';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const routeLabels: Record<string, string> = {
  '/app/home': 'Home',
  '/app/cultural': 'Cultural Companion',
  '/app/coach': 'My Coach',
  '/app/assessment': 'Assessment',
  '/app/profile': 'Profile',
  '/app/coach-dashboard': 'Coach Dashboard',
  '/app/admin/dashboard': 'Dashboard',
  '/app/admin/users/contacts': 'Contacts',
  '/app/admin/users/members': 'Members',
  '/app/admin/users/organizations': 'Organizations',
  '/app/admin/users/coaches': 'Coaches',
  '/app/admin/users/admins': 'Admin Users',
  '/app/admin/content/emails': 'Automated Emails',
  '/app/admin/content/newsletter': 'Newsletter',
  '/app/admin/system/security': 'Security Metrics',
  '/app/admin/system/audit': 'Audit Log',
  '/app/admin/intelligence/seo': 'SEO Analytics',
  '/app/admin/intelligence/competitors': 'Competitive Analysis',
  '/app/admin/analytics': 'Engagement Analytics',
  '/app/progress': 'Progress',
};

function getBreadcrumbs(pathname: string) {
  const segments: { label: string; path: string }[] = [];

  if (pathname.startsWith('/app/admin')) {
    segments.push({ label: 'Admin', path: '/app/admin/dashboard' });

    if (pathname.includes('/users/')) {
      segments.push({ label: 'User Management', path: pathname });
    } else if (pathname.includes('/content/')) {
      segments.push({ label: 'Content Manager', path: pathname });
    } else if (pathname.includes('/system/')) {
      segments.push({ label: 'System Admin', path: pathname });
    } else if (pathname.includes('/intelligence/')) {
      segments.push({ label: 'Intelligence', path: pathname });
    }
  }

  const label = routeLabels[pathname];
  if (label) {
    segments.push({ label, path: pathname });
  }

  return segments;
}

function BurgerTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      onClick={toggleSidebar}
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

export function TopBar() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { user, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  // Unread notification count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await (supabase as any)
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  return (
    <>
      <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3 shrink-0">
        <BurgerTrigger />

        <nav className="flex items-center gap-1 text-sm flex-1 min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground/50 mx-1">/</span>}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'font-semibold text-foreground truncate'
                    : 'text-muted-foreground truncate'
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleDark}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
            onClick={() => setNotifOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => signOut()}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <NotificationsDrawer open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  );
}
