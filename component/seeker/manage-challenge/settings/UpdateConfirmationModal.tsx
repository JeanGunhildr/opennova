"use client";

import { Check } from "lucide-react";

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export default function UpdateConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: UpdateConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.70)" }}
    >
      <div
        className="w-full max-w-[480px] bg-[#191919] border border-[#393939] rounded-[16px] p-5 md:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(227,0,0,0.12)] border border-[rgba(227,0,0,0.3)] flex items-center justify-center shrink-0">
            <Check size={20} className="text-[#E30000]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-white">Konfirmasi Pembaruan</h3>
            <p className="text-[11px] text-[#A4A4A4]">Tinjau sebelum menyimpan perubahan challenge</p>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-[#A4A4A4] mb-6">
          Pembaruan informasi deskripsi, ketentuan pengumpulan, dan kriteria penilaian akan langsung berlaku dan dapat dilihat oleh seluruh Solver yang telah bergabung.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2E2E2E]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-[36px] px-4 rounded-full border border-[#4A4A4A] text-white text-xs font-medium hover:bg-[#242424] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="h-[36px] px-5 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
