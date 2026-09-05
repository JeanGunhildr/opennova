"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface WithdrawConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawConfirmationModal({
  onClose,
  onConfirm,
}: WithdrawConfirmationModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[420px] bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_20px_50px_rgba(17,24,39,0.15)] p-6 text-center flex flex-col items-center"
      >
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-primary-500 mb-4">
          <AlertTriangle size={26} strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="text-[19px] font-bold text-gray-900 mb-2">
          Batal Ikuti Challenge?
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
          Anda akan membatalkan partisipasi pada challenge ini. Tautan submission atau berkas yang sudah tersimpan akan dihapus dari antrean penilaian.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-[13px] font-semibold transition-colors"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[13px] font-semibold transition-colors shadow-sm"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
