"use client";

import { Info, X } from "lucide-react";
import { useEffect } from "react";

interface PaymentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BULLET_POINTS = [
  "Setiap challenge dikenakan biaya layanan platform sebesar 10% dari nominal hadiah yang ditetapkan.",
  "Pembayaran challenge dilakukan melalui Virtual Account Bank yang telah disediakan pada bagian Hadiah & Pembayaran.",
  "Minimal nominal pembayaran atau hadiah challenge adalah Rp500.000.",
  "Dana yang telah disetorkan akan disimpan dalam escrow platform, sebelum nantinya diserahkan kepada pemenang challenge atau dikembalikan ke pihak Seeker.",
  "Jika pihak Seeker melakukan pembatalan challenge, maka dana hadiah akan dikembalikan total dan biaya layanan platform yang telah disetorkan akan dikembalikan dengan besaran 80%.",
];

export default function PaymentInfoModal({
  isOpen,
  onClose,
}: PaymentInfoModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-150"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-[#191919] border border-[#393939] rounded-[16px] p-5 md:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2E2E2E] mb-4">
          <div className="flex items-center gap-2.5">
            <Info size={19} className="text-[#3B82F6] shrink-0" />
            <h3 className="text-sm font-bold text-white">Informasi Pembayaran</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-[#2A2829] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content: 5 Bullet Points */}
        <div className="space-y-3">
          {BULLET_POINTS.map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#C8C8C8] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
