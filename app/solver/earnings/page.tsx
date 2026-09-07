import { Download, Plus, CheckCircle2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import StatWidget from "@/component/dashboard/StatWidget";
import { getSolverBalanceAction, getSolverCertificatesAction } from "@/lib/actions/balance";

const BANKS = [
  { id: "bca",    name: "Bank BCA",    account: "••• 4821", selected: true  },
  { id: "mandiri",name: "Bank Mandiri",account: "••• 9032", selected: false },
];

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const [balanceData, certificates] = await Promise.all([
    getSolverBalanceAction(),
    getSolverCertificatesAction(),
  ]);
  const { balance, transactions } = balanceData;

  const formattedBalance = `Rp ${balance.toLocaleString("id-ID")}`;

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
        <StatWidget
          variant="balance"
          totalBalance={balance}
          withdrawableBalance={balance}
        />
        <StatWidget
          variant="earnings"
          totalEarnings={balance}
        />
        <StatWidget
          variant="wins"
          totalWins={certificates.length}
        />
      </div>

      {/* Body: certificates + withdrawal panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        <div className="flex flex-col gap-6 min-w-0">
          {/* ── Certificate table card ─────────────────── */}
          <div className="bg-white border border-[#E2E3E5] rounded-[16px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7E9]">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-bold text-gray-900">Sertifikat & Pencapaian</h2>
                <span className="bg-primary-500 text-white text-[12px] font-bold px-2.5 py-1 rounded-full">
                  {certificates.length}
                </span>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#E5E7E9] bg-white">
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Challenge</span>
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Tanggal</span>
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Pencapaian</span>
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Unduh</span>
            </div>

            {/* Rows */}
            {certificates.length === 0 ? (
              <div className="px-6 py-10 text-center text-[13px] text-gray-500">
                Belum ada sertifikat pencapaian yang diperoleh.
              </div>
            ) : (
              certificates.map((row, i) => (
                <div
                  key={row.id}
                  className={[
                    "grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6",
                    "min-h-[68px] py-3",
                    i < certificates.length - 1 ? "border-b border-[#E8EAEC]" : "",
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
                    title="Unduh sertifikat (segera hadir)"
                    disabled
                    className="w-[42px] h-[42px] flex items-center justify-center bg-gray-50 border border-[#D9DCDD] rounded-[10px] text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <Download size={16} strokeWidth={1.8} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ── Transaction History Card ──────────────── */}
          <div className="bg-white border border-[#E2E3E5] rounded-[16px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7E9]">
              <h2 className="text-[18px] font-bold text-gray-900">Riwayat Transaksi Saldo</h2>
              <span className="text-[12px] font-medium text-gray-500">
                {transactions.length} transaksi
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="px-6 py-8 text-center text-[13px] text-gray-500">
                Belum ada mutasi saldo tercatat.
              </div>
            ) : (
              <div className="divide-y divide-[#E8EAEC]">
                {transactions.map((tx) => {
                  const isCredit = tx.amount >= 0;
                  return (
                    <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-gray-900">
                            {tx.description || (isCredit ? "Hadiah Kompetisi" : "Pencairan Saldo")}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(tx.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[14px] font-bold ${
                          isCredit ? "text-emerald-600" : "text-gray-900"
                        }`}
                      >
                        {isCredit ? "+" : "-"} Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Withdrawal panel ───────────────────────── */}
        <div className="bg-[#1E1E1E] rounded-[20px] p-5 flex flex-col gap-4 h-fit">
          <h2 className="text-[16px] font-bold text-white">Pencairan Dana</h2>

          {/* Total saldo */}
          <div className="bg-[#2C2C2C] border border-[#6F6F6F] rounded-[18px] p-4">
            <p className="text-[13px] text-gray-400 mb-1">Total Saldo</p>
            <p className="text-[26px] font-bold text-white tracking-tight">{formattedBalance}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Tersedia untuk dicairkan: <span className="text-white font-semibold">{formattedBalance}</span>
            </p>
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
            <p className="text-[26px] font-bold text-white tracking-tight mb-3">{formattedBalance}</p>
            <button
              type="button"
              disabled={balance <= 0}
              className="w-full h-[44px] bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[14px] font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proses Pencairan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}