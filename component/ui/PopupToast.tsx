"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastNotification {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface PopupToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
  duration?: number;
}

export default function PopupToast({
  toast,
  onDismiss,
  duration = 4000,
}: PopupToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, duration]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  const iconContainerBg = isSuccess
    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
    : isError
    ? "bg-red-500/15 border border-red-500/30 text-red-400"
    : "bg-blue-500/15 border border-blue-500/30 text-blue-400";

  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className="flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl max-w-[380px] backdrop-blur-md transition-all"
        style={{
          background: "rgba(28, 28, 28, 0.95)",
          border: isSuccess
            ? "1px solid rgba(84, 214, 122, 0.35)"
            : isError
            ? "1px solid rgba(227, 0, 0, 0.4)"
            : "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconContainerBg}`}
        >
          {isSuccess ? (
            <CheckCircle2 size={18} strokeWidth={2.2} />
          ) : isError ? (
            <AlertCircle size={18} strokeWidth={2.2} />
          ) : (
            <Info size={18} strokeWidth={2.2} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[14px] font-bold text-white leading-tight">
            {toast.title}
          </p>
          <p className="text-[12px] text-gray-300 mt-1 leading-[1.45] break-words">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
