import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white text-slate-800 border-slate-200">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-brand-600 flex-shrink-0" />}
      
      <p className="text-sm font-medium">{toast.message}</p>
      
      <button 
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
