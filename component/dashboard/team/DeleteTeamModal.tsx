"use client";

import { useEffect } from "react";
import { TriangleAlert, LogOut } from "lucide-react";

type ModalMode = "delete" | "leave";

interface DeleteTeamModalProps {
  isOpen: boolean;
  mode: ModalMode;
  teamName: string;
  isLocked?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTeamModal({
  isOpen,
  mode,
  teamName,
  isLocked = false,
  onClose,
  onConfirm,
}: DeleteTeamModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDelete = mode === "delete";

  const title = isDelete ? "Bubarkan Tim?" : "Keluar dari Tim?";
  const description = isDelete
    ? "Tim akan dinonaktifkan dan tidak akan muncul lagi di daftar tim Anda. Data riwayat dan sertifikat tetap tersimpan."
    : "Anda akan keluar dari tim ini. Anda masih bisa bergabung kembali dengan kode undangan selama tim tidak penuh atau terkunci.";
  const confirmLabel = isDelete ? "Bubarkan Tim" : "Keluar Tim";
  const Icon = isDelete ? TriangleAlert : LogOut;
  const iconBg = isDelete ? "bg-primary-100" : "bg-amber-100";
  const iconColor = isDelete ? "text-primary-500" : "text-amber-600";
  const confirmBg = isDelete
    ? "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white"
    : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(4px)" }}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[440px] bg-white border border-gray-200 rounded-[20px] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.20)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Icon */}
        <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon size={26} className={iconColor} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2
          id="delete-modal-title"
          className="text-[22px] font-bold text-gray-900 mt-[18px] leading-tight"
        >
          {title}
        </h2>

        {/* Description */}
        <p className="text-[14px] text-gray-600 leading-[1.55] mt-2 max-w-[340px] mx-auto">
          {description}
        </p>

        {/* Locked warning */}
        {isLocked && (
          <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2 mt-3 max-w-[340px] mx-auto">
            ⚠️ Tim ini sedang terkunci karena mengikuti challenge. Tindakan ini tidak dapat dilakukan.
          </p>
        )}

        {/* Team reference pill */}
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[10px] px-3.5 py-2.5 mt-4">
          <span className="text-[14px] font-semibold text-gray-900">{teamName}</span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full bg-white border border-gray-300 text-[15px] font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLocked}
            className={[
              "h-11 rounded-full text-[15px] font-semibold transition-colors",
              isLocked ? "opacity-40 cursor-not-allowed bg-gray-300 text-gray-600" : confirmBg,
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}