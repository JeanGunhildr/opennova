"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";

import {
  formatDateID,
  formatRupiah,
} from "@/lib/data/admin";

import type { ActiveChallengeRow } from "@/lib/data/admin";
import {
  approveChallengeAction,
  rejectChallengeAction,
} from "@/lib/actions/admin-challenge";

import TableCard from "./TableCard";
import SearchInput from "./SearchInput";

import {
  StatusPill,
  activeChallengeStatusTone,
} from "./StatusPill";

type StatusFilter = "all" | "pending" | "active" | "completed" | "rejected";

interface ActiveChallengesTableProps {
  challenges: ActiveChallengeRow[];
}

export default function ActiveChallengesTable({
  challenges,
}: ActiveChallengesTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Modal & Action states
  const [selectedChallenge, setSelectedChallenge] =
    useState<ActiveChallengeRow | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return challenges.filter((row) => {
      const isPendingRow =
        row.status === "Menunggu Persetujuan" || row.rawStatus === "pending";
      const isCompletedRow =
        row.status === "Selesai" || row.rawStatus === "completed";
      const isRejectedRow =
        row.status === "Ditolak" || row.rawStatus === "rejected";
      const isActiveRow = !isPendingRow && !isCompletedRow && !isRejectedRow;

      // Filter status
      let matchesStatus = true;
      if (statusFilter === "pending") matchesStatus = isPendingRow;
      else if (statusFilter === "active") matchesStatus = isActiveRow;
      else if (statusFilter === "completed") matchesStatus = isCompletedRow;
      else if (statusFilter === "rejected") matchesStatus = isRejectedRow;

      if (!matchesStatus) return false;

      // Search query
      if (!q) return true;

      return (
        row.name.toLowerCase().includes(q) ||
        row.seekerName.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      );
    });
  }, [challenges, query, statusFilter]);

  // Dynamic counts derived from database array
  const counts = useMemo(() => {
    let pending = 0;
    let active = 0;
    let completed = 0;
    let rejected = 0;

    challenges.forEach((row) => {
      const isPendingRow =
        row.status === "Menunggu Persetujuan" || row.rawStatus === "pending";
      const isCompletedRow =
        row.status === "Selesai" || row.rawStatus === "completed";
      const isRejectedRow =
        row.status === "Ditolak" || row.rawStatus === "rejected";

      if (isPendingRow) pending++;
      else if (isCompletedRow) completed++;
      else if (isRejectedRow) rejected++;
      else active++;
    });

    return {
      all: challenges.length,
      pending,
      active,
      completed,
      rejected,
    };
  }, [challenges]);

  const handleOpenModal = (
    row: ActiveChallengeRow,
    type: "approve" | "reject"
  ) => {
    setSelectedChallenge(row);
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!selectedChallenge || !actionType || isPending) return;

    setIsPending(true);
    try {
      const res =
        actionType === "approve"
          ? await approveChallengeAction(selectedChallenge.id)
          : await rejectChallengeAction(selectedChallenge.id);

      if (res.success) {
        showToast(
          actionType === "approve"
            ? `Challenge "${selectedChallenge.name}" berhasil disetujui!`
            : `Challenge "${selectedChallenge.name}" berhasil ditolak.`,
          "success"
        );
      } else {
        showToast(res.error || "Gagal memproses tindakan.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Terjadi kesalahan server.", "error");
    } finally {
      setIsPending(false);
      setSelectedChallenge(null);
      setActionType(null);
    }
  };

  return (
    <>
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-[12px] shadow-lg text-white text-xs font-semibold flex items-center gap-2.5 transition-all ${
            toastMessage.type === "success" ? "bg-[#168A39]" : "bg-[#E30000]"
          }`}
        >
          {toastMessage.type === "success" ? (
            <Check size={16} strokeWidth={2.5} />
          ) : (
            <AlertCircle size={16} strokeWidth={2.5} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <TableCard
        title="Daftar Challenge"
        countLabel={`${rows.length} challenge ditampilkan`}
        toolbar={
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Status filter */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                  statusFilter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Semua
                <span className="ml-1 text-gray-400">({counts.all})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                  statusFilter === "pending"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Menunggu Persetujuan
                <span className="ml-1 text-amber-600 font-bold">
                  ({counts.pending})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                  statusFilter === "active"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Aktif
                <span className="ml-1 text-gray-400">({counts.active})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("completed")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                  statusFilter === "completed"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Selesai
                <span className="ml-1 text-gray-400">({counts.completed})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("rejected")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                  statusFilter === "rejected"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Ditolak
                <span className="ml-1 text-gray-400">({counts.rejected})</span>
              </button>
            </div>

            {/* Search */}
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari nama challenge / seeker..."
              className="sm:w-[260px]"
            />
          </div>
        }
      >
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3 whitespace-nowrap">Nama Challenge</th>
              <th className="px-5 py-3 whitespace-nowrap">Kategori</th>
              <th className="px-5 py-3 whitespace-nowrap">Nominal Hadiah</th>
              <th className="px-5 py-3 whitespace-nowrap">Tanggal Dipublikasikan</th>
              <th className="px-5 py-3 whitespace-nowrap">Status</th>
              <th className="px-5 py-3 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const isPendingRow =
                row.status === "Menunggu Persetujuan" ||
                row.rawStatus === "pending";

              return (
                <tr
                  key={row.id}
                  className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4 max-w-[280px]">
                    <p className="font-semibold text-gray-900 leading-snug">
                      {row.name}
                    </p>
                    <p className="text-[12.5px] text-gray-400 mt-0.5">
                      {row.seekerName}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">{row.category}</td>

                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-900">
                    {formatRupiah(row.rewardAmount)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {formatDateID(row.publishedAt)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusPill
                      label={row.status}
                      tone={activeChallengeStatusTone(row.status)}
                    />
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Action 1: Lihat Detail */}
                      <Link
                        href={`/admin/challenges/${row.id}`}
                        className="h-8 px-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-[12px] font-medium inline-flex items-center gap-1 transition-colors"
                        title="Lihat Detail Challenge"
                      >
                        <Eye size={14} />
                        <span>Lihat</span>
                      </Link>

                      {/* Action 2: Approve & Reject if pending */}
                      {isPendingRow && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenModal(row, "approve")}
                            className="h-8 px-2.5 rounded-lg bg-[#168A39] hover:bg-[#12702E] text-white text-[12px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Setujui Challenge"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenModal(row, "reject")}
                            className="h-8 px-2.5 rounded-lg border border-red-200 text-[#E30000] hover:bg-red-50 text-[12px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Tolak Challenge"
                          >
                            <XCircle size={14} />
                            <span>Tolak</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-400 text-[14px]"
                >
                  Tidak ada challenge yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>

      {/* Confirmation Modal */}
      {selectedChallenge && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-[16px] max-w-[420px] w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  actionType === "approve"
                    ? "bg-green-100 text-[#168A39]"
                    : "bg-red-100 text-[#E30000]"
                }`}
              >
                {actionType === "approve" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <AlertCircle size={22} />
                )}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">
                  {actionType === "approve"
                    ? "Setujui Challenge"
                    : "Tolak Challenge"}
                </h3>
                <p className="text-[12px] text-gray-500">Konfirmasi Tindakan Admin</p>
              </div>
            </div>

            <p className="text-[13.5px] text-gray-700 leading-relaxed mb-6">
              {actionType === "approve"
                ? "Apakah Anda yakin ingin menyetujui challenge ini? Status akan diperbarui menjadi aktif dan Solver dapat mulai mendaftar."
                : "Apakah Anda yakin ingin menolak challenge ini? Challenge tidak akan dipublikasikan ke platform."}
            </p>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[10px] mb-6 text-[12.5px]">
              <span className="font-semibold text-gray-900 block truncate">
                {selectedChallenge.name}
              </span>
              <span className="text-gray-500 block truncate">
                Penyelenggara: {selectedChallenge.seekerName}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedChallenge(null);
                  setActionType(null);
                }}
                disabled={isPending}
                className="h-10 px-4 rounded-full border border-gray-300 text-gray-700 text-[13px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isPending}
                className={`h-10 px-5 rounded-full text-white text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-[#168A39] hover:bg-[#12702E]"
                    : "bg-[#E30000] hover:bg-[#C10000]"
                }`}
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : actionType === "approve" ? (
                  "Ya, Setujui"
                ) : (
                  "Ya, Tolak"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}