import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in select-none">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
        type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' :
        type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-100' :
        'bg-indigo-950/90 border-indigo-500/50 text-indigo-100'
      }`}>
        {type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
        {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}

        <span className="text-xs font-semibold">{message}</span>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
