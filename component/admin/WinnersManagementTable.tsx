"use client";

import { useMemo, useState } from "react";
import { Send, Upload, Users2, User, X, FileCheck2 } from "lucide-react";
import { winners as initialWinners, type WinnerRow } from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";
import { StatusPill } from "./StatusPill";
import PopupToast, { type ToastNotification } from "@/component/ui/PopupToast";

function ManageWinnerModal({
  winner,
  onClose,
  onSave,
}: {
  winner: WinnerRow;
  onClose: () => void;
  onSave: (winnerId: string, fileName: string) => void;
}) {
  const [fileName, setFileName] = useState<string | undefined>(
    winner.certificateFileName
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[520px] bg-white rounded-[18px] shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900">
              Kelola Sertifikat Pemenang
            </h3>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {winner.challengeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-[12px] bg-gray-50 border border-gray-200 p-3.5">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
              {winner.isTeam ? (
                <Users2 size={18} className="text-primary-500" strokeWidth={1.8} />
              ) : (
                <User size={18} className="text-primary-500" strokeWidth={1.8} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 truncate">
                {winner.winnerName}
              </p>
              <p className="text-[12.5px] text-gray-500">
                {winner.isTeam
                  ? `Tim beranggotakan ${winner.teamSize} orang`
                  : "Peserta perorangan"}
              </p>
            </div>
          </div>

          {winner.isTeam && winner.teamMembers && (
            <div>
              <p className="text-[13px] font-semibold text-gray-700 mb-2">
                Anggota Tim
              </p>
              <ul className="flex flex-col gap-1.5">
                {winner.teamMembers.map((member) => (
                  <li
                    key={member}
                    className="text-[13.5px] text-gray-600 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">
              Unggah File Sertifikat
            </p>
            <label
              className="flex items-center gap-3 h-[52px] px-4 rounded-[12px] border-2 border-dashed border-gray-300 hover:border-[#E30000] cursor-pointer transition-colors bg-gray-50"
            >
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />
              <Upload size={18} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
              <span className="text-[13.5px] text-gray-500 truncate flex-1">
                {fileName ?? "Klik untuk memilih file (PDF/JPG/PNG)"}
              </span>
            </label>
            {fileName && (
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-emerald-600 font-medium">
                <FileCheck2 size={14} strokeWidth={2} />
                {fileName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-full border border-gray-300 text-gray-700 text-[14px] font-semibold hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => fileName && onSave(winner.id, fileName)}
            disabled={!fileName}
            className="flex-1 h-[44px] rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={15} strokeWidth={2.2} />
            Kirim Sertifikat
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WinnersManagementTable() {
  const [winners, setWinners] = useState<WinnerRow[]>(initialWinners);
  const [query, setQuery] = useState("");
  const [activeWinner, setActiveWinner] = useState<WinnerRow | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return winners;
    return winners.filter(
      (row) =>
        row.winnerName.toLowerCase().includes(q) ||
        row.challengeName.toLowerCase().includes(q) ||
        row.seekerName.toLowerCase().includes(q)
    );
  }, [winners, query]);

  const handleSave = (winnerId: string, fileName: string) => {
    setWinners((prev) =>
      prev.map((w) =>
        w.id === winnerId
          ? { ...w, certificateIssued: true, certificateFileName: fileName }
          : w
      )
    );
    setActiveWinner(null);
    setToast({
      type: "success",
      title: "Sertifikat Terkirim",
      message: "Sertifikat berhasil dikirim ke pemenang challenge.",
    });
  };

  return (
    <>
      <TableCard
        title="Detail & Manajemen Pemenang Challenge"
        countLabel={`${winners.length} pemenang tercatat`}
        toolbar={
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Cari nama pemenang / challenge..."
            className="sm:w-[280px]"
          />
        }
      >
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3 whitespace-nowrap">Nama Pemenang</th>
              <th className="px-5 py-3 whitespace-nowrap">Jumlah Anggota</th>
              <th className="px-5 py-3 whitespace-nowrap">Challenge Dimenangkan</th>
              <th className="px-5 py-3 whitespace-nowrap text-center">Status Sertifikat</th>
              <th className="px-5 py-3 whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-900">{row.winnerName}</p>
                  <p className="text-[12.5px] text-gray-400 mt-0.5">
                    {row.isTeam ? "Tim" : "Perorangan"}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {row.isTeam ? `${row.teamSize} orang` : "\u2014"}
                </td>
                <td className="px-5 py-4 max-w-[280px]">
                  <p className="text-gray-900 leading-snug">{row.challengeName}</p>
                  <p className="text-[12.5px] text-gray-400 mt-0.5">{row.seekerName}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <StatusPill
                      label={row.certificateIssued ? "Sudah Dikirim" : "Belum Dikirim"}
                      tone={row.certificateIssued ? "green" : "amber"}
                    />
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setActiveWinner(row)}
                    className="inline-flex items-center gap-1.5 h-[36px] px-4 rounded-full text-[13px] font-semibold border border-gray-300 text-gray-700 hover:border-[#E30000] hover:text-[#E30000] transition-colors"
                  >
                    Kelola
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                  Tidak ada pemenang yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>

      {activeWinner && (
        <ManageWinnerModal
          winner={activeWinner}
          onClose={() => setActiveWinner(null)}
          onSave={handleSave}
        />
      )}

      <PopupToast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
