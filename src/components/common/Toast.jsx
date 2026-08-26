import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const { msg, type } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-primary shrink-0" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-100';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-100';
      default:
        return 'bg-surface-container border-outline-variant text-on-surface dark:bg-slate-800 dark:border-slate-700 dark:text-white';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in transition-all">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-dropdown max-w-md ${getBg()}`}>
        {getIcon()}
        <span className="text-sm font-medium">{msg}</span>
      </div>
    </div>
  );
}
