import { TrendingUp, Trophy, ArrowRight } from "lucide-react";

type StatVariant = "balance" | "earnings" | "wins";

interface StatWidgetProps {
  variant: StatVariant;
}

function BalanceCard() {
  return (
    <div
      className="relative rounded-[16px] p-5 overflow-hidden min-h-[200px] flex flex-col justify-between"
      style={{ background: "linear-gradient(115deg, #1E1E1E 0%, #7A0000 100%)" }}
    >
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FF4D4D, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-8 -right-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #888888, transparent)" }}
      />

      <div className="relative">
        <p className="text-[14px] text-gray-400 mb-1">Total Saldo</p>
        <p className="text-[28px] font-bold text-white tracking-tight">
          Rp 71.000.000
        </p>
      </div>

      <div className="relative mt-4">
        <p className="text-[13px] text-gray-400 mb-1">Saldo Dapat Dicairkan</p>
        <p className="text-[22px] font-bold text-white tracking-tight">
          Rp 50.000.000
        </p>
      </div>
    </div>
  );
}

function EarningsCard() {
  return (
    <div className="bg-white border border-[#E2E3E5] rounded-[16px] p-5 min-h-[200px] flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div>
        <p className="text-[14px] font-medium text-gray-600">Total Perolehan</p>
        <p className="text-[30px] font-bold text-gray-900 tracking-tight mt-1">
          Rp 121.000.000
        </p>
        <p className="text-[13px] text-gray-500 mt-0.5">Sepanjang waktu</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="flex items-center gap-1 bg-[#E6F4E8] text-[#15803D] text-[12px] font-semibold px-2.5 py-1 rounded-full">
          <TrendingUp size={13} strokeWidth={2} />
          +12% bulan ini
        </span>
      </div>
    </div>
  );
}

function WinsCard() {
  return (
    <div className="bg-white border border-[#E2E3E5] rounded-[16px] p-5 min-h-[200px] flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div>
        <p className="text-[14px] font-medium text-gray-600">Total Challenge Dimenangkan</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-[12px] bg-secondary-100 flex items-center justify-center">
            <Trophy size={24} className="text-primary-500" strokeWidth={1.8} />
          </div>
          <p className="text-[34px] font-bold text-gray-900 tracking-tight">5</p>
        </div>
        <p className="text-[13px] text-gray-500 mt-1">challenge berhasil dimenangkan</p>
      </div>

      <button
        type="button"
        className="flex items-center gap-1 text-[13px] font-semibold text-primary-500 hover:text-primary-600 transition-colors mt-4"
      >
        Lihat detail
        <ArrowRight size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export default function StatWidget({ variant }: StatWidgetProps) {
  if (variant === "balance")  return <BalanceCard />;
  if (variant === "earnings") return <EarningsCard />;
  return <WinsCard />;
}