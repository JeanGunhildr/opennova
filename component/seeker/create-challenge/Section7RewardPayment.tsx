"use client";
import { useState } from "react";
import { Info, Star, CreditCard } from "lucide-react";
import PaymentInfoModal from "./modals/PaymentInfoModal";
import VirtualAccountModal from "./modals/VirtualAccountModal";

const CARD_STYLE: React.CSSProperties = { background: "#191919", border: "1px solid #373737", borderRadius: "16px", padding: "16px 18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.30)" };
const BADGE_STYLE: React.CSSProperties = { width: "22px", height: "22px", borderRadius: "50%", border: "1px solid #E30000", color: "#E30000", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const LABEL_STYLE: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "#A4A4A4", textTransform: "uppercase", letterSpacing: "0.015em", marginBottom: "6px", display: "block" };

const BANKS = [
  { id: "bca",    label: "BCA"     },
  { id: "bni",    label: "BNI"     },
  { id: "bri",    label: "BRI"     },
  { id: "mandiri",label: "Mandiri" },
];

function fmt(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

interface Section7Props {
  rewardAmount: number;
  selectedBank: string | null;
  paymentStatus: "pending" | "paid";
  onReward: (n: number) => void;
  onBank: (id: string) => void;
  onPaymentPaid: () => void;
}

export default function Section7RewardPayment({ rewardAmount, selectedBank, paymentStatus, onReward, onBank, onPaymentPaid }: Section7Props) {
  const [showPayInfo, setShowPayInfo] = useState(false);
  const [showVA, setShowVA] = useState(false);

  const fee = Math.floor(rewardAmount * 0.1);
  const total = rewardAmount + fee;
  const isSpecial = rewardAmount >= 40_000_000;
  const canPay = selectedBank !== null && rewardAmount >= 500_000;

  function handleConfirmTransfer() {
    onPaymentPaid();
    setShowVA(false);
  }

  return (
    <>
      <div style={CARD_STYLE}>
        <div className="flex items-start gap-[10px] mb-4">
          <div style={BADGE_STYLE}>7</div>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#F7F7F7" }}>Hadiah &amp; Pembayaran</h3>
            <p style={{ fontSize: "11px", color: "#737373", marginTop: "3px" }}>Nominal hadiah challenge dan penyelesaian pembayaran.</p>
          </div>
        </div>

        {/* Reward input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-[6px]">
            <label style={LABEL_STYLE}>Hadiah Penghargaan</label>
            {isSpecial && (
              <span className="inline-flex items-center gap-1 rounded-full" style={{ height: "24px", padding: "0 9px", background: "rgba(216,200,58,0.12)", border: "1px solid rgba(216,200,58,0.3)", color: "#D8C83A", fontSize: "10px", fontWeight: 700 }}>
                <Star size={10} strokeWidth={2.2} />Kolaborasi Spesial
              </span>
            )}
          </div>
          <div className="flex items-center rounded-[9px] overflow-hidden" style={{ height: "40px", background: "#171717", border: "1px solid #373737" }}>
            <span style={{ padding: "0 10px", fontSize: "13px", fontWeight: 600, color: "#737373", flexShrink: 0 }}>Rp</span>
            <input type="number" value={rewardAmount || ""} min={0}
              onChange={e => onReward(parseInt(e.target.value) || 0)}
              onFocus={e => { (e.target as HTMLInputElement).closest("div")!.style.border = "1px solid #E30000"; }}
              onBlur={e => { (e.target as HTMLInputElement).closest("div")!.style.border = "1px solid #373737"; }}
              placeholder="0" style={{ flex: 1, height: "100%", background: "transparent", border: "none", outline: "none", color: "#F7F7F7", fontSize: "14px", fontWeight: 600 }} />
          </div>
          <p style={{ fontSize: "10px", color: "#737373", marginTop: "3px" }}>Minimal hadiah Rp500.000</p>
          {isSpecial && <p style={{ fontSize: "10px", color: "#D8C83A", marginTop: "3px" }}>Hadiah mencapai ambang Kolaborasi Spesial dan mendapat prioritas penempatan Solver.</p>}
        </div>

        {/* Calculation block */}
        <div className="rounded-[9px] p-[10px] mb-3" style={{ background: "#232323", border: "1px solid #373737" }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "11px", color: "#A4A4A4" }}>Hadiah</span>
            <span style={{ fontSize: "11px", color: "#F7F7F7" }}>{rewardAmount > 0 ? fmt(rewardAmount) : "—"}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "11px", color: "#A4A4A4" }}>Biaya (10%)</span>
            <span style={{ fontSize: "11px", color: "#BDBDBD" }}>{rewardAmount > 0 ? fmt(fee) : "—"}</span>
          </div>
          <div className="h-px my-1.5" style={{ background: "#373737" }} />
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#F7F7F7" }}>Total Bayar</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#F7F7F7" }}>{rewardAmount > 0 ? fmt(total) : "—"}</span>
          </div>
        </div>

        {/* Payment info notice */}
        <div className="flex gap-2 rounded-[8px] p-[10px] mb-4" style={{ background: "#17223D", border: "1px solid rgba(138,168,255,0.45)" }}>
          <Info size={13} strokeWidth={2} style={{ color: "#8AA8FF", flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "10px", lineHeight: "1.5", color: "#BDBDBD" }}>
            Dana hadiah disimpan dalam escrow dan diserahkan kepada pemenang setelah challenge selesai.{" "}
            <button type="button" onClick={() => setShowPayInfo(true)} style={{ color: "#8AA8FF", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "10px" }}>
              Lihat informasi lebih lanjut
            </button>
          </p>
        </div>

        {/* Payment status */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#A4A4A4" }}>Status Pembayaran</span>
          <span className="inline-flex items-center h-[24px] px-3 rounded-full text-[11px] font-semibold"
            style={paymentStatus === "paid" ? { background: "#143520", color: "#54D67A" } : { background: "#393713", color: "#D8C83A" }}>
            {paymentStatus === "paid" ? "Lunas" : "Menunggu Pembayaran"}
          </span>
        </div>

        {/* Bank selection */}
        <div className="mb-3">
          <label style={LABEL_STYLE}>Transfer Bank (Virtual Account)</label>
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map(bank => {
              const sel = selectedBank === bank.id;
              return (
                <button key={bank.id} type="button" onClick={() => onBank(bank.id)}
                  className="flex flex-col items-center justify-center gap-[3px] rounded-[7px] transition-all"
                  style={{ height: "52px", background: sel ? "#3B1313" : "#171717", border: sel ? "1px solid #E30000" : "1px solid #373737" }}>
                  <CreditCard size={18} strokeWidth={1.6} style={{ color: sel ? "#E30000" : "#A4A4A4" }} />
                  <span style={{ fontSize: "9px", fontWeight: 600, color: sel ? "#F7F7F7" : "#A4A4A4" }}>{bank.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pay button */}
        <button type="button" onClick={() => canPay && setShowVA(true)} disabled={!canPay}
          className="w-full inline-flex items-center justify-center rounded-[8px] text-white text-[12px] font-bold transition-colors"
          style={{ height: "40px", background: canPay ? "#E30000" : "#373737", opacity: canPay ? 1 : 0.7, cursor: canPay ? "pointer" : "not-allowed" }}>
          Bayar Via Virtual Account
        </button>
      </div>

      {showPayInfo && <PaymentInfoModal onClose={() => setShowPayInfo(false)} />}
      {showVA && selectedBank && (
        <VirtualAccountModal bank={selectedBank} onClose={() => setShowVA(false)} onConfirmTransfer={handleConfirmTransfer} />
      )}
    </>
  );
}