import { NavLink, useLocation } from 'react-router-dom';
import { Home, Globe, Heart, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/app/home', label: 'Home', icon: Home },
  { path: '/app/cultural', label: 'Cultural', icon: Globe },
  { path: '/app/coach', label: 'Coach', icon: Heart },
  { path: '/app/assessment', label: 'Assessment', icon: BarChart3 },
  { path: '/app/profile', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto pb-safe">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              <span className={cn('font-medium', active && 'font-semibold')}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
