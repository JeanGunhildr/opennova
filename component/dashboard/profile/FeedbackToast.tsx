"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

export interface ToastState {
  title: string;
  description: string;
}

interface FeedbackToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export default function FeedbackToast({ toast, onDismiss }: FeedbackToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998]">
      <div className="bg-gray-900 text-white rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.22)] max-w-[340px]">
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 size={15} className="text-[#3FC86B]" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight">{toast.title}</p>
          <p className="text-[12px] text-white/70 mt-0.5 leading-[1.45]">{toast.description}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-0.5 text-white/50 hover:text-white transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}