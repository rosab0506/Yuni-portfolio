import type { ReactNode } from 'react';
import { X, FileText } from 'lucide-react';

export type ResumeViewerModalProps = {
  isOpen: boolean;
  title?: ReactNode;
  previewUrl?: string;
  onClose: () => void;
};

export function ResumeViewerModal({ isOpen, title, previewUrl, onClose }: ResumeViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl border border-slate-200/50 animate-slide-up">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-morph" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-morph floating-delayed" />
        
        <div className="relative mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg animate-bounce-subtle">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {title ?? 'Resume Preview'}
            </h2>
          </div>
          <button 
            type="button" 
            className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-white bg-slate-100 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" 
            onClick={onClose}
          >
            <X className="w-4 h-4 group-hover:animate-wiggle" />
            Close
          </button>
        </div>
        {previewUrl ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <iframe 
              title="Resume Preview" 
              src={previewUrl} 
              className="relative h-[70vh] w-full rounded-xl border border-slate-200 shadow-inner bg-white" 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500">
            <FileText className="w-16 h-16 text-slate-300 mb-4 animate-bounce-subtle" />
            <p className="text-lg font-medium">No preview available</p>
            <p className="text-sm text-slate-400">The resume file cannot be displayed</p>
          </div>
        )}
      </div>
    </div>
  );
}
