"use client";

import { X, ShieldCheck, FileText } from "lucide-react";
import { useEffect } from "react";

interface CopyrightAgreementModalProps {
  onClose: () => void;
}

export default function CopyrightAgreementModal({ onClose }: CopyrightAgreementModalProps) {
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
        className="w-full max-w-[540px] bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_20px_50px_rgba(17,24,39,0.15)] flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="h-[54px] px-5 flex items-center justify-between border-b border-[#E5E7EB] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-primary-500">
              <ShieldCheck size={16} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">
              Kesepakatan Hak Cipta Inovasi
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-[13px] text-gray-600 leading-relaxed">
          <p>
            Dengan mengikuti dan mengumpulkan solusi pada challenge ini di platform OpenNova, Anda menyetujui ketentuan hak cipta dan kekayaan intelektual (HAKI) berikut:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-4 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-gray-800">Orisinalitas Karya:</strong> Seluruh karya atau inovasi yang dikumpulkan harus merupakan hasil karya asli Solver / Tim yang bersangkutan dan tidak melanggar hak cipta pihak ketiga mana pun.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-gray-800">Status Hak Cipta Solusi Pemenang:</strong> Apabila inovasi Anda dinyatakan sebagai pemenang challenge dan menerima hadiah, hak cipta komersial dialihkan atau dilisensikan secara non-eksklusif kepada pihak Seeker (penyelenggara) sesuai kesepakatan tertulis.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-gray-800">Kerahasiaan Data Solver:</strong> Ide inovasi yang tidak terpilih tetap menjadi hak cipta penuh milik Solver dan tidak boleh digunakan oleh pihak Seeker tanpa persetujuan tertulis.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-gray-800">Perlindungan Escrow:</strong> Dana hadiah telah diamankan di sistem escrow OpenNova dan akan disalurkan secara aman setelah penetapan pemenang resmi.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-[12px]">
            <FileText size={15} className="text-gray-400" />
            <span>Dokumen perjanjian resmi ini diverifikasi oleh tim legal OpenNova & Seeker.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[13px] font-semibold transition-colors shadow-sm"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
