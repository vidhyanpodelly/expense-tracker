import React from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  isOffline?: boolean;
}

export const ErrorBanner = ({ message, isOffline }: ErrorBannerProps) => {
  if (!message) return null;
  return (
    <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${isOffline ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200' : 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'}`}>
      {isOffline ? <WifiOff className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
