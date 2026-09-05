"use client";

import { Info, X } from "lucide-react";
import { useEffect } from "react";

export interface AssessmentPaymentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BULLET_POINTS = [
  "Penilaian challenge dilakukan dalam dua tahap, yaitu Penjurian Ahli dan Pitching Final.",
  "Penjurian Ahli merupakan tahap penilaian awal. Seeker menilai berkas inovasi yang dikirim Solver melalui submission berdasarkan kriteria yang telah ditetapkan.",
  "Pitching Final merupakan tahap lanjutan bagi Solver yang lolos sebagai finalis untuk mempresentasikan inovasinya secara langsung dengan Seeker baik secara online maupun offline, untuk menentukan pemenang challenge.",
  "Seeker menghubungi Solver terpilih untuk melakukan Pitching Final melalui email yang ditampilkan di halaman Kelola Challenge.",
  "Teknis pelaksanaan tahap Pitching Final ditentukan oleh Seeker, sementara proses penilaian tetap dilakukan melalui Opennova.",
  "Seeker dapat menentukan persentase bobot penilaian untuk masing-masing tahapan, dengan total bobot penilaian sebesar 100%.",
  "Pemenang challenge adalah individu/tim yang berhasil memperoleh skor tertinggi setelah perhitungan akhir.",
];

export default function AssessmentPaymentInfoModal({
  isOpen,
  onClose,
}: AssessmentPaymentInfoModalProps) {
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
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-[#191919] border border-[#393939] rounded-[16px] p-5 md:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2E2E2E] mb-4">
          <div className="flex items-center">
            <Info size={20} className="w-5 h-5 text-[#3B82F6] shrink-0" />
            <h3 className="text-sm font-bold text-white ml-2.5">
              Informasi Penilaian
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-[#2A2829] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content: 5 Bullet Points from Figma */}
        <div className="space-y-3">
          {BULLET_POINTS.map((text, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-[#C8C8C8] leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
