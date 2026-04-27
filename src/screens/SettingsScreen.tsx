import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { User, LogOut, Shield, Bell } from 'lucide-react';

export const SettingsScreen = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </header>

      <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-2">Preferences</h3>
        <div className="rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3 text-slate-700">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="font-medium">Notifications</span>
            </div>
            <span className="text-sm text-slate-400">On</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="h-5 w-5 text-slate-400" />
              <span className="font-medium">Privacy & Security</span>
            </div>
          </button>
        </div>
      </section>

      <section className="pt-4">
        <Button 
          variant="danger" 
          className="w-full"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" /> Log Out
        </Button>
      </section>
    </div>
  );
};
