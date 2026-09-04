"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface TeamAlertModalProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  /** Optional extra detail — e.g. the generated join code */
  detail?: string;
  detailLabel?: string;
  onClose: () => void;
}

const CONFIG: Record<
  AlertType,
  { Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; iconBg: string; iconColor: string }
> = {
  success: {
    Icon: CheckCircle2,
    iconBg: "bg-[#E5F3E8]",
    iconColor: "text-[#379B49]",
  },
  error: {
    Icon: XCircle,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-500",
  },
  warning: {
    Icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  info: {
    Icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
};

export default function TeamAlertModal({
  isOpen,
  type,
  title,
  message,
  detail,
  detailLabel,
  onClose,
}: TeamAlertModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { Icon, iconBg, iconColor } = CONFIG[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(4px)" }}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[420px] bg-white border border-gray-200 rounded-[20px] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.20)] relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Icon */}
        <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon size={26} className={iconColor} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2
          id="alert-modal-title"
          className="text-[20px] font-bold text-gray-900 mt-[18px] leading-tight"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-[14px] text-gray-600 leading-[1.55] mt-2 max-w-[340px] mx-auto">
          {message}
        </p>

        {/* Optional detail pill (e.g. join code) */}
        {detail && (
          <div className="mt-4 inline-flex flex-col items-center gap-1">
            {detailLabel && (
              <span className="text-[12px] text-gray-500 font-medium">{detailLabel}</span>
            )}
            <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-2.5">
              <span className="font-mono text-[20px] font-bold tracking-[0.2em] text-gray-900 select-all">
                {detail}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Klik kode untuk menyalin</span>
          </div>
        )}

        {/* Action button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-11 w-full rounded-full bg-gray-900 text-white text-[15px] font-semibold hover:bg-gray-800 active:bg-gray-700 transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
