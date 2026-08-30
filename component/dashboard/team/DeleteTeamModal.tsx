"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

interface DeleteTeamModalProps {
  isOpen: boolean;
  teamName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTeamModal({
  isOpen,
  teamName,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(4px)" }}
      role="presentation"
    >
      <div
        className="w-full max-w-[440px] bg-white border border-gray-200 rounded-[20px] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.20)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Warning icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
          <TriangleAlert size={26} className="text-primary-500" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2
          id="delete-modal-title"
          className="text-[22px] font-bold text-gray-900 mt-[18px] leading-tight"
        >
          Hapus Tim?
        </h2>

        {/* Description */}
        <p className="text-[14px] text-gray-600 leading-[1.55] mt-2 max-w-[340px] mx-auto">
          Tim dan informasi terkait akan dihapus. Tindakan ini tidak dapat dibatalkan.
        </p>

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
            className="h-11 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-[15px] font-semibold text-white transition-colors"
          >
            Hapus Tim
          </button>
        </div>
      </div>
    </div>
  );
}