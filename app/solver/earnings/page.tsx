import { Download, Plus, CheckCircle2 } from "lucide-react";
import StatWidget from "@/component/dashboard/StatWidget";
import { certificateRows } from "@/lib/data/dashboard";

const BANKS = [
  { id: "bca",    name: "Bank BCA",    account: "••• 4821", selected: true  },
  { id: "mandiri",name: "Bank Mandiri",account: "••• 9032", selected: false },
];

export default function EarningsPage() {
  return (
    <div className="px-6 lg:px-10 py-8 lg:py-9 max-w-[1160px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[36px] lg:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
          Perolehan
        </h1>
        <p className="text-[16px] text-gray-500 mt-2 leading-[1.5]">
          Kelola saldo, unduh sertifikat, dan cairkan hadiahmu.
        </p>
      </div>

      {/* Summary stat grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatWidget variant="balance" />
        <StatWidget variant="earnings" />
        <StatWidget variant="wins" />
      </div>

      {/* Body: certificates + withdrawal panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Certificate table card ─────────────────── */}
        <div className="bg-white border border-[#E2E3E5] rounded-[16px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7E9]">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] font-bold text-gray-900">Sertifikat & Pencapaian</h2>
              <span className="bg-primary-500 text-white text-[12px] font-bold px-2.5 py-1 rounded-full">
                {certificateRows.length}
              </span>
            </div>
            <button
              type="button"
              className="text-[13px] font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Lihat semua
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#E5E7E9] bg-white">
            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Challenge</span>
            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Tanggal</span>
            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Status</span>
            <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Unduh</span>
          </div>

          {/* Rows */}
          {certificateRows.map((row, i) => (
            <div
              key={row.id}
              className={[
                "grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6",
                "min-h-[68px] py-3",
                i < certificateRows.length - 1 ? "border-b border-[#E8EAEC]" : "",
              ].join(" ")}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-900 truncate">{row.challengeName}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{row.company}</p>
              </div>
              <span className="text-[13px] text-gray-600 whitespace-nowrap">{row.date}</span>
              <span className="bg-secondary-100 text-primary-500 text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                {row.status}
              </span>
              <button
                type="button"
                aria-label="Unduh sertifikat"
                className="w-[42px] h-[42px] flex items-center justify-center bg-gray-50 border border-[#D9DCDD] rounded-[10px] text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Download size={16} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Withdrawal panel ───────────────────────── */}
        <div className="bg-[#1E1E1E] rounded-[20px] p-5 flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-white">Pencairan Dana</h2>

          {/* Total saldo */}
          <div className="bg-[#2C2C2C] border border-[#6F6F6F] rounded-[18px] p-4">
            <p className="text-[13px] text-gray-400 mb-1">Total Saldo</p>
            <p className="text-[26px] font-bold text-white tracking-tight">Rp 71.000.000</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Tersedia untuk dicairkan: <span className="text-white font-semibold">Rp 50.000.000</span></p>
          </div>

          {/* Payment methods */}
          <div className="bg-white rounded-[18px] p-4">
            <p className="text-[13px] font-semibold text-gray-700 mb-3">Metode Pembayaran</p>
            <div className="space-y-0 divide-y divide-[#E5E5E5]">
              {BANKS.map((bank) => (
                <div key={bank.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-[46px] h-[46px] rounded-[8px] bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600 flex-shrink-0">
                    {bank.id.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900">{bank.name}</p>
                    <p className="text-[12px] text-gray-500">{bank.account}</p>
                  </div>
                  <div className={[
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    bank.selected
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 bg-white",
                  ].join(" ")}>
                    {bank.selected && <CheckCircle2 size={12} className="text-white" strokeWidth={2.5} />}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 flex items-center justify-center gap-2 w-full h-[42px] bg-gray-900 text-white text-[13px] font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus size={15} strokeWidth={2.2} />
              Tambah Rekening
            </button>
          </div>

          {/* Withdrawal execution */}
          <div className="bg-[#2C2C2C] border border-[#676767] rounded-[18px] p-4">
            <p className="text-[13px] text-gray-400 mb-2">Dana Yang Dicairkan</p>
            <p className="text-[26px] font-bold text-white tracking-tight mb-3">Rp 50.000.000</p>
            <button
              type="button"
              className="w-full h-[44px] bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[14px] font-semibold rounded-full transition-colors"
            >
              Proses Pencairan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}