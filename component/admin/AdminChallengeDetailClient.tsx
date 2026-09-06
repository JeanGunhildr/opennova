"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileText,
  Loader2,
  Target,
  Trophy,
  XCircle,
  AlertCircle,
  Check,
  Download,
  Ban,
} from "lucide-react";

import type { AdminChallengeDetail } from "@/lib/data/admin-server";
import {
  formatDateID,
  formatRupiah,
} from "@/lib/data/admin";
import { StatusPill, activeChallengeStatusTone } from "./StatusPill";
import {
  approveChallengeAction,
  rejectChallengeAction,
  takeDownChallengeAction,
} from "@/lib/actions/admin-challenge";

interface AdminChallengeDetailClientProps {
  challenge: AdminChallengeDetail;
}

export default function AdminChallengeDetailClient({
  challenge,
}: AdminChallengeDetailClientProps) {
  const router = useRouter();
  const [modalAction, setModalAction] = useState<
    "approve" | "reject" | "takedown" | null
  >(null);
  const [isPending, setIsPending] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isPendingStatus =
    challenge.status === "Menunggu Persetujuan" ||
    challenge.rawStatus === "pending";

  const isTakedownStatus =
    challenge.status === "Takedown" || challenge.rawStatus === "taken_down";

  const isActiveStatus =
    !isPendingStatus &&
    !isTakedownStatus &&
    challenge.rawStatus !== "completed" &&
    challenge.rawStatus !== "rejected";

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmAction = async () => {
    if (!modalAction || isPending) return;

    setIsPending(true);
    try {
      let res;
      if (modalAction === "approve") {
        res = await approveChallengeAction(challenge.id);
      } else if (modalAction === "reject") {
        res = await rejectChallengeAction(challenge.id);
      } else {
        res = await takeDownChallengeAction(challenge.id);
      }

      if (res.success) {
        showToast(
          modalAction === "approve"
            ? `Challenge "${challenge.name}" berhasil disetujui!`
            : modalAction === "reject"
            ? `Challenge "${challenge.name}" telah ditolak.`
            : `Challenge "${challenge.name}" berhasil di-takedown.`,
          "success"
        );
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        showToast(res.error || "Gagal memproses tindakan.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Terjadi kesalahan server.", "error");
    } finally {
      setIsPending(false);
      setModalAction(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1240px] mx-auto">
      {/* Toast Feedback */}
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

      {/* Header Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Dashboard</span>
        </Link>

        {isPendingStatus && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setModalAction("reject")}
              className="h-10 px-5 rounded-full border border-red-200 text-[#E30000] hover:bg-red-50 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <XCircle size={16} />
              <span>Tolak Challenge</span>
            </button>

            <button
              type="button"
              onClick={() => setModalAction("approve")}
              className="h-10 px-6 rounded-full bg-[#168A39] hover:bg-[#12702E] text-white text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={16} />
              <span>Setujui Challenge</span>
            </button>
          </div>
        )}

        {isActiveStatus && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setModalAction("takedown")}
              className="h-10 px-5 rounded-full border border-red-200 text-[#E30000] hover:bg-red-50 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Ban size={16} />
              <span>Takedown Challenge</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden shadow-2xs mb-6">
        {/* Banner header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold">
                {challenge.categoryName}
              </span>
              <StatusPill
                label={challenge.status}
                tone={activeChallengeStatusTone(challenge.status)}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              {challenge.name}
            </h1>
            <p className="text-[13px] text-gray-300 flex items-center gap-2">
              <Building2 size={14} className="text-gray-400" />
              <span>{challenge.seekerName}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-white/10 p-4 rounded-[12px] backdrop-blur-xs">
            <span className="text-[11px] text-gray-300 font-medium uppercase tracking-wide">
              Total Hadiah (Prize Pool)
            </span>
            <span className="text-2xl font-black text-amber-400">
              {formatRupiah(challenge.prizePool)}
            </span>
          </div>
        </div>

        {/* Pending Banner Alert if pending */}
        {isPendingStatus && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <p className="text-[13px] font-medium text-amber-900 leading-snug">
                Challenge ini diajukan oleh Seeker dan sedang menunggu persetujuan dari Admin. Silakan periksa detail sebelum menyetujui.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setModalAction("reject")}
                className="h-8 px-3 rounded-lg border border-amber-300 text-amber-900 hover:bg-amber-100 text-[12px] font-semibold transition-colors"
              >
                Tolak
              </button>
              <button
                type="button"
                onClick={() => setModalAction("approve")}
                className="h-8 px-3.5 rounded-lg bg-[#168A39] hover:bg-[#12702E] text-white text-[12px] font-semibold transition-colors"
              >
                Setujui
              </button>
            </div>
          </div>
        )}

        {/* Takedown Banner Alert if taken_down */}
        {isTakedownStatus && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Ban size={20} className="text-[#E30000] shrink-0" />
              <p className="text-[13px] font-medium text-red-900 leading-snug">
                Challenge ini telah di-takedown oleh Admin. Challenge tidak dapat diikuti atau menerima submission baru.
              </p>
            </div>
          </div>
        )}

        {/* Detail Sections */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deskripsi */}
            <section className="space-y-2">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <FileText size={17} className="text-[#E30000]" />
                Deskripsi Challenge
              </h3>
              <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                {challenge.description || "Belum ada deskripsi yang diisi."}
              </p>
            </section>

            {/* Tujuan Inovasi */}
            <section className="space-y-2">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <Target size={17} className="text-[#E30000]" />
                Tujuan Inovasi ({challenge.objectives.length})
              </h3>
              {challenge.objectives.length > 0 ? (
                <ul className="space-y-2 bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                  {challenge.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-gray-700">
                      <CheckCircle2 size={15} className="text-[#168A39] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-gray-500 italic">Belum ada tujuan inovasi yang ditentukan.</p>
              )}
            </section>

            {/* Ketentuan Pengumpulan */}
            <section className="space-y-2">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <FileCheck size={17} className="text-[#E30000]" />
                Ketentuan Pengumpulan ({challenge.requirements.length})
              </h3>
              {challenge.requirements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1.5 text-[13.5px] text-gray-700 bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                  {challenge.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-gray-500 italic">Belum ada ketentuan pengumpulan.</p>
              )}
            </section>

            {/* Kriteria Penilaian */}
            <section className="space-y-3">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <Trophy size={17} className="text-[#E30000]" />
                Kriteria Penilaian (Bobot: Expert {challenge.expertWeight}% / Pitch {challenge.pitchWeight}%)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-[12px] border border-gray-200">
                  <span className="text-[12px] font-bold text-[#E30000] block mb-2">
                    Penjurian Ahli ({challenge.expertWeight}%)
                  </span>
                  <div className="space-y-2 text-[12.5px]">
                    {challenge.criteria
                      .filter((c) => c.stage === "expert_judging")
                      .map((c) => (
                        <div key={c.id} className="border-b border-gray-200/60 pb-1.5 last:border-none">
                          <span className="font-semibold text-gray-900 block">{c.name}</span>
                          {c.description && <span className="text-gray-500 text-[11.5px]">{c.description}</span>}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-[12px] border border-gray-200">
                  <span className="text-[12px] font-bold text-[#E30000] block mb-2">
                    Pitching Final ({challenge.pitchWeight}%)
                  </span>
                  <div className="space-y-2 text-[12.5px]">
                    {challenge.criteria
                      .filter((c) => c.stage === "final_pitch")
                      .map((c) => (
                        <div key={c.id} className="border-b border-gray-200/60 pb-1.5 last:border-none">
                          <span className="font-semibold text-gray-900 block">{c.name}</span>
                          {c.description && <span className="text-gray-500 text-[11.5px]">{c.description}</span>}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar Metadata */}
          <div className="space-y-5">
            <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-5 space-y-4 text-[13px]">
              <h4 className="text-[14px] font-bold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Seeker & Pembayaran
              </h4>

              <div>
                <span className="text-gray-500 text-[11px] block uppercase font-semibold">Nama Perusahaan</span>
                <span className="font-semibold text-gray-900">{challenge.seekerCompanyName || challenge.seekerName}</span>
              </div>

              {challenge.seekerRepresentative && (
                <div>
                  <span className="text-gray-500 text-[11px] block uppercase font-semibold">Perwakilan</span>
                  <span className="text-gray-900">{challenge.seekerRepresentative}</span>
                </div>
              )}

              <div>
                <span className="text-gray-500 text-[11px] block uppercase font-semibold">Batas Waktu (Deadline)</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1.5 mt-0.5">
                  <Calendar size={14} className="text-[#E30000]" />
                  {challenge.deadline ? formatDateID(challenge.deadline) : "Belum ditentukan"}
                </span>
              </div>

              <div>
                <span className="text-gray-500 text-[11px] block uppercase font-semibold">Tanggal Dibuat</span>
                <span className="text-gray-700">{formatDateID(challenge.createdAt)}</span>
              </div>

              {challenge.copyrightAgreementPath && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 text-[11px] block uppercase font-semibold mb-1">Surat Perjanjian Hak Cipta</span>
                  <a
                    href={challenge.copyrightAgreementPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#E30000] hover:underline"
                  >
                    <Download size={14} />
                    <span>Unduh Perjanjian (PDF)</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-[16px] max-w-[420px] w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  modalAction === "approve"
                    ? "bg-green-100 text-[#168A39]"
                    : "bg-red-100 text-[#E30000]"
                }`}
              >
                {modalAction === "approve" ? (
                  <CheckCircle2 size={22} />
                ) : modalAction === "reject" ? (
                  <AlertCircle size={22} />
                ) : (
                  <Ban size={22} />
                )}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">
                  {modalAction === "approve"
                    ? "Setujui Challenge"
                    : modalAction === "reject"
                    ? "Tolak Challenge"
                    : "Takedown Challenge"}
                </h3>
                <p className="text-[12px] text-gray-500">Konfirmasi Admin</p>
              </div>
            </div>

            <p className="text-[13.5px] text-gray-700 leading-relaxed mb-6">
              {modalAction === "approve"
                ? "Apakah Anda yakin ingin menyetujui challenge ini? Challenge akan dipublikasikan dan status akan diperbarui menjadi aktif."
                : modalAction === "reject"
                ? "Apakah Anda yakin ingin menolak challenge ini? Challenge tidak akan dipublikasikan ke platform."
                : "Apakah Anda yakin ingin men-takedown challenge ini? Challenge yang sudah ditakedown tidak dapat diikuti atau menerima submission baru."}
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalAction(null)}
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
                  modalAction === "approve"
                    ? "bg-[#168A39] hover:bg-[#12702E]"
                    : "bg-[#E30000] hover:bg-[#C10000]"
                }`}
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : modalAction === "approve" ? (
                  "Ya, Setujui"
                ) : modalAction === "reject" ? (
                  "Ya, Tolak"
                ) : (
                  "Ya, Takedown"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
