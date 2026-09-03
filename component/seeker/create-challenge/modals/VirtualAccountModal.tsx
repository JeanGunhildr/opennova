"use client";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

const BANK_LABELS: Record<string, string> = { bca: "BCA", bni: "BNI", bri: "BRI", mandiri: "Mandiri" };

function generateVA(): string {
  return "88012 " + Math.floor(10000 + Math.random() * 89999) + " " + Math.floor(1000 + Math.random() * 8999) + " " + Math.floor(100 + Math.random() * 899);
}

interface VirtualAccountModalProps {
  bank: string;
  onClose: () => void;
  onConfirmTransfer: () => void;
}

export default function VirtualAccountModal({ bank, onClose, onConfirmTransfer }: VirtualAccountModalProps) {
  const [vaNumber] = useState(generateVA);
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(86400);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeStr = `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

  function handleCopy() {
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: "400px", maxWidth: "calc(100vw - 32px)", background: "#1F1F1F", border: "1px solid #373737", borderRadius: "18px", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-[18px]" style={{ height: "54px", borderBottom: "1px solid #373737" }}>
          <span className="text-white font-semibold" style={{ fontSize: "15px" }}>Virtual Account ({BANK_LABELS[bank] ?? bank})</span>
        </div>
        {/* Body */}
        <div className="p-[18px] flex flex-col gap-4">
          {/* VA number */}
          <div>
            <p className="text-[11px] font-bold mb-[7px]" style={{ color: "#A4A4A4", textTransform: "uppercase", letterSpacing: "0.015em" }}>Nomor VA</p>
            <div className="flex items-center justify-between px-[18px] rounded-[12px]"
              style={{ height: "78px", background: "#3B1313", border: "1px solid rgba(227,0,0,0.55)" }}>
              <span className="font-bold tracking-wide text-white" style={{ fontSize: "25px", letterSpacing: "0.02em" }}>{vaNumber}</span>
              <button onClick={handleCopy} className="flex items-center justify-center rounded-full transition-colors"
                style={{ width: "36px", height: "36px", color: copied ? "#54D67A" : "#F7F7F7" }}>
                {copied ? <Check size={18} strokeWidth={2} /> : <Copy size={18} strokeWidth={1.8} />}
              </button>
            </div>
          </div>
          {/* Countdown */}
          <p style={{ fontSize: "13px", color: "#A4A4A4" }}>
            Selesaikan pembayaran dalam{" "}
            <span className="font-bold text-white">{timeStr}</span>
          </p>
        </div>
        {/* Actions */}
        <div className="grid grid-cols-[1fr_1.3fr] gap-[10px] p-[0_18px_18px]">
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-medium transition-colors"
            style={{ height: "46px", background: "transparent", border: "1px solid #5C5C5C" }}>Batal</button>
          <button onClick={onConfirmTransfer} className="inline-flex items-center justify-center rounded-full text-[14px] font-semibold transition-colors"
            style={{ height: "46px", background: "#FFFFFF", color: "#171717" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ECECEC")}
            onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}>
            Selesai Transfer
          </button>
        </div>
      </div>
    </div>
  );
}