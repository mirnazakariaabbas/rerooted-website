import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  return (
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

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
