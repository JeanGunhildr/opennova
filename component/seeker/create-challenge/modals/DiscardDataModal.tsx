"use client";
import { Trash2 } from "lucide-react";

interface DiscardDataModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiscardDataModal({ onClose, onConfirm }: DiscardDataModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex flex-col items-center text-center"
        style={{ width: "430px", maxWidth: "calc(100vw - 32px)", background: "#1F1F1F", border: "1px solid #373737", borderRadius: "18px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
        <div className="flex items-center justify-center rounded-full"
          style={{ width: "54px", height: "54px", background: "#3B1313", border: "1px solid rgba(227,0,0,0.25)" }}>
          <Trash2 size={24} strokeWidth={1.8} style={{ color: "#E30000" }} />
        </div>
        <h2 className="mt-[18px] font-bold text-white" style={{ fontSize: "21px" }}>Hapus Data Challenge?</h2>
        <p className="mt-2" style={{ fontSize: "13px", lineHeight: "1.55", color: "#A4A4A4", maxWidth: "360px" }}>
          Seluruh data yang sudah Anda masukkan akan dihapus. Anda tetap berada di halaman ini dan bisa mengisi ulang form dari awal.
        </p>
        <div className="grid grid-cols-2 gap-[10px] mt-6 w-full">
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold transition-colors"
            style={{ height: "44px", background: "#232323", border: "1px solid #5C5C5C" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#373737")}
            onMouseLeave={e => (e.currentTarget.style.background = "#232323")}>Batal</button>
          <button type="button" onClick={onConfirm} className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors"
            style={{ height: "44px" }}>Hapus Data</button>
        </div>
      </div>
    </div>
  );
}