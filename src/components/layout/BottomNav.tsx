import { NavLink, useLocation } from 'react-router-dom';
import { Home, Globe, Heart, BarChart3, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/hooks/useAdmin';

const memberTabs = [
  { path: '/app/home', label: 'Home', icon: Home },
  { path: '/app/cultural', label: 'Cultural', icon: Globe },
  { path: '/app/coach', label: 'Coach', icon: Heart },
  { path: '/app/assessment', label: 'Assessment', icon: BarChart3 },
  { path: '/app/profile', label: 'Profile', icon: User },
];

const adminTab = { path: '/app/admin', label: 'Admin', icon: Shield };

const BottomNav = () => {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const tabs = isAdmin ? [adminTab, ...memberTabs] : memberTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50">
      <div className="flex justify-around items-center h-18 max-w-2xl mx-auto pb-safe py-2">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              <span className={cn('font-medium', active && 'font-bold')}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
