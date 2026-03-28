import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { NotificationsDrawer } from '@/components/layout/NotificationsDrawer';
import { GlobalSearch } from '@/components/layout/GlobalSearch';
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

export function TopBar() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { user, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

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
          {/* Search trigger */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Search</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>

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
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
