import React, { InputHTMLAttributes } from 'react';
import { cn } from '../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white',
              icon && 'pl-10',
              error && 'ring-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
