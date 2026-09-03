"use client";
import { X, Info } from "lucide-react";

const BULLETS = [
  "Setiap challenge dikenakan biaya layanan platform sebesar 10% dari nominal hadiah yang ditetapkan.",
  "Pembayaran challenge dilakukan melalui Virtual Account Bank yang telah disediakan pada bagian Hadiah \u0026 Pembayaran.",
  "Minimal nominal pembayaran hadiah challenge adalah Rp500.000.",
  "Dana yang telah disetorkan akan disimpan dalam escrow platform sebelum nantinya diserahkan kepada pemenang challenge atau dikembalikan ke pihak Seeker.",
  "Jika pihak Seeker melakukan pembatalan challenge, dana hadiah akan dikembalikan total dan biaya layanan platform yang telah disetorkan akan dikembalikan dengan besaran 80%.",
];

export default function PaymentInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: "600px", maxWidth: "calc(100vw - 32px)", background: "#1F1F1F", border: "1px solid #373737", borderRadius: "18px", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-[18px]" style={{ height: "54px", borderBottom: "1px solid #373737", flexShrink: 0 }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full" style={{ width: "26px", height: "26px", background: "#17223D" }}>
              <Info size={14} strokeWidth={2} style={{ color: "#8AA8FF" }} />
            </div>
            <span className="text-white font-semibold" style={{ fontSize: "15px" }}>Informasi Pembayaran</span>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-full transition-colors"
            style={{ width: "32px", height: "32px", background: "transparent", color: "#737373" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#373737"; (e.currentTarget as HTMLElement).style.color = "#F7F7F7"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#737373"; }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-[18px] flex flex-col gap-[10px]">
          {BULLETS.map((b, i) => (
            <div key={i} className="grid items-start gap-[10px]" style={{ gridTemplateColumns: "14px minmax(0,1fr)" }}>
              <span className="rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", background: "#8AA8FF", marginTop: "7px" }} />
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#ECECEC" }}>{b}</p>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="flex justify-end p-[0_18px_18px]">
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-full text-white text-[13px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors"
            style={{ height: "40px", padding: "0 18px" }}>Tutup</button>
        </div>
      </div>
    </div>
  );
}