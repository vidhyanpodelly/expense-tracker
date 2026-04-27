import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
};
