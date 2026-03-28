import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAdmin } from '@/hooks/useAdmin';
import { useCoachRole } from '@/hooks/useCoachRole';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Globe, Heart, BarChart3, User, Shield, Briefcase,
  Users, Building2, GraduationCap, UserCog, UsersRound,
  Mail, FileText, Settings, ChevronDown,
  LogOut, TrendingUp, Search as SearchIcon,
  Monitor, ShieldCheck, Rss, Linkedin, History, UserCheck,
  HelpCircle, PenLine, MessageSquareQuote, Layout, MessageCircle, MessagesSquare, UsersRound as GroupIcon, Megaphone,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const memberNav = [
  { path: '/app/home', label: 'Home', icon: Home },
  { path: '/app/cultural', label: 'Cultural Companion', icon: Globe },
  { path: '/app/coach', label: 'My Coach', icon: Heart },
  { path: '/app/assessment', label: 'Assessment', icon: BarChart3 },
  { path: '/app/progress', label: 'Progress', icon: TrendingUp },
  { path: '/app/messages', label: 'Messages', icon: MessageCircle },
  { path: '/app/community', label: 'Community', icon: MessagesSquare },
  { path: '/app/profile', label: 'Profile', icon: User },
];

const systemUserNav = [
  { path: '/app/admin/users/contacts', label: 'Contacts', icon: Users },
  { path: '/app/admin/users/members', label: 'Members', icon: UsersRound },
  { path: '/app/admin/users/organizations', label: 'Organizations', icon: Building2 },
  { path: '/app/admin/users/coaches', label: 'Coaches', icon: GraduationCap },
  { path: '/app/admin/users/admins', label: 'Admin Users', icon: UserCog },
  { path: '/app/admin/users/subscribers', label: 'Subscribers', icon: UserCheck },
  { path: '/app/admin/users/linkedin', label: 'LinkedIn Contacts', icon: Linkedin },
  { path: '/app/admin/users/history', label: 'Role History', icon: History },
];

const contentNav = [
  { path: '/app/admin/content/emails', label: 'Automated Emails', icon: Mail },
  { path: '/app/admin/content/newsletter', label: 'Newsletter', icon: FileText },
  { path: '/app/admin/content/rss', label: 'RSS Monitor', icon: Rss },
  { path: '/app/admin/content/blog', label: 'Blog', icon: PenLine },
  { path: '/app/admin/content/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { path: '/app/admin/content/pages', label: 'Page Content', icon: Layout },
  { path: '/app/admin/content/messages', label: 'Messages', icon: MessageCircle },
  { path: '/app/admin/content/forum', label: 'Forum Moderation', icon: MessagesSquare },
];

const systemAdminNav = [
  { path: '/app/admin/system/security', label: 'Security Metrics', icon: Shield },
  { path: '/app/admin/system/audit', label: 'Audit Log', icon: Settings },
  { path: '/app/admin/system/sessions', label: 'Active Sessions', icon: Monitor },
  { path: '/app/admin/system/ip-allowlist', label: 'IP Allowlist', icon: ShieldCheck },
];

const intelligenceNav = [
  { path: '/app/admin/intelligence/seo', label: 'SEO Analytics', icon: TrendingUp },
  { path: '/app/admin/intelligence/competitors', label: 'Competitive Analysis', icon: SearchIcon },
];

const analyticsNav = [
  { path: '/app/admin/analytics', label: 'Engagement', icon: BarChart3 },
];

const coachNav = [
  { path: '/app/coach-dashboard', label: 'Coach Dashboard', icon: Briefcase },
];

function NavGroup({
  label,
  items,
  defaultOpen,
  collapsed,
}: {
  label: string;
  items: { path: string; label: string; icon: React.ElementType }[];
  defaultOpen?: boolean;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isGroupActive = items.some(i => location.pathname.startsWith(i.path));

  if (collapsed) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <NavLink
                    to={item.path}
                    end
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
                      active && 'bg-sidebar-accent text-sidebar-foreground border-l-2 border-sidebar-primary'
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-foreground"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen || isGroupActive}>
      <SidebarGroup>
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="flex items-center justify-between cursor-pointer text-sidebar-foreground/50 hover:text-sidebar-foreground/70 uppercase text-[10px] tracking-widest font-semibold">
            {label}
            <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const active = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        end
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
                          active && 'bg-sidebar-accent text-sidebar-foreground border-l-2 border-sidebar-primary font-semibold'
                        )}
                        activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { isAdmin } = useAdmin();
  const { isCoach } = useCoachRole();
  const { user, signOut } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || '?';

  const roleBadge = isAdmin ? 'Admin' : isCoach ? 'Coach' : 'Member';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-lg font-display font-bold text-sidebar-foreground tracking-tight">
              Re-Rooted<span className="text-xs align-super">®</span>
            </span>
          </a>
        ) : (
          <a href="/" className="text-lg font-display font-bold text-sidebar-foreground text-center block hover:opacity-80 transition-opacity">R</a>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Admin dashboard link */}
        {isAdmin && (
          <NavGroup label="Overview" items={[{ path: '/app/admin/dashboard', label: 'Dashboard', icon: Home }]} defaultOpen collapsed={collapsed} />
        )}

        {/* Member navigation */}
        <NavGroup label="My App" items={memberNav} defaultOpen collapsed={collapsed} />

        {/* Coach navigation */}
        {isCoach && (
          <NavGroup label="Coaching" items={coachNav} defaultOpen collapsed={collapsed} />
        )}

        {/* Admin navigation buckets */}
        {isAdmin && (
          <>
            <NavGroup label="User Management" items={systemUserNav} collapsed={collapsed} />
            <NavGroup label="Content Manager" items={contentNav} collapsed={collapsed} />
            <NavGroup label="System Admin" items={systemAdminNav} collapsed={collapsed} />
            <NavGroup label="Analytics" items={analyticsNav} collapsed={collapsed} />
            <NavGroup label="Intelligence" items={intelligenceNav} collapsed={collapsed} />
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-sidebar-accent text-sidebar-foreground">
              <AvatarFallback className="text-xs font-semibold bg-sidebar-accent text-sidebar-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </p>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-sidebar-border text-sidebar-foreground/60">
                {roleBadge}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              title="Help Tour"
              onClick={() => {
                localStorage.removeItem('onboarding-tour-complete');
                window.dispatchEvent(new Event('restart-tour'));
              }}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
