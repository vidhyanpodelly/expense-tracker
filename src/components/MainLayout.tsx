import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings } from 'lucide-react';
import { cn } from '../utils';
import { ErrorBanner } from '../components/ErrorBanner';

export const MainLayout = () => {
  const isOffline = !navigator.onLine;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/expenses', icon: Receipt, label: 'Expenses' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50 relative">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {isOffline && (
          <div className="sticky top-0 z-50 p-4 bg-slate-50">
            <ErrorBanner message="You are currently offline. Viewing cached data." isOffline />
          </div>
        )}
        <Outlet />
      </div>

      <nav className="absolute bottom-0 w-full border-t border-slate-200 bg-white/80 backdrop-blur-md pb-safe">
        <div className="flex justify-around p-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-xl p-2 min-w-[70px] transition-colors',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                )
              }
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
