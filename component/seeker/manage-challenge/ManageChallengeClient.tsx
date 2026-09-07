"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import {
  moveChallengeToJudgingAction,
  selectFinalistsAction,
  announceWinnerAction,
} from "@/lib/actions/seeker-manage";
import ManageChallengeHeader from "./ManageChallengeHeader";
import AssessmentSubmenu from "./AssessmentSubmenu";
import ChallengeSettingsTab from "./ChallengeSettingsTab";
import DiscussionTab from "./discussion/DiscussionTab";
import { Loader2, ArrowRight, CheckCircle2, Trophy, Sparkles, X, AlertTriangle } from "lucide-react";

// Map challenge DB status → internal lifecycle stage
export type SeekerLifecycleStage =
  | "PENJURIAN_AHLI"
  | "PITCHING_FINAL"
  | "PENGUMUMAN_PEMENANG";

function mapStatusToStage(status: string): SeekerLifecycleStage {
  switch (status) {
    case "judging":
      return "PENJURIAN_AHLI";
    case "final_pitch":
      return "PITCHING_FINAL";
    case "completed":
      return "PENGUMUMAN_PEMENANG";
    default:
      return "PENJURIAN_AHLI";
  }
}

interface ManageChallengeClientProps {
  data: ManageChallengeData;
}

export default function ManageChallengeClient({ data }: ManageChallengeClientProps) {
  const defaultStage = mapStatusToStage(data.status);
  const [activeStage, setActiveStage] = useState<SeekerLifecycleStage>(defaultStage);
  const [primaryTab, setPrimaryTab] = useState<"assessment" | "discussion" | "settings">(
    "assessment"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingConfirmAction, setPendingConfirmAction] = useState<"judging" | "finalists" | "winner" | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pendingConfirmAction !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [pendingConfirmAction]);

  // Transition Action Handlers
  async function confirmMoveToJudging() {
    setPendingConfirmAction(null);
    setIsSubmitting(true);
    setActionError(null);
    const res = await moveChallengeToJudgingAction(data.id);
    setIsSubmitting(false);
    if (!res.success) {
      setActionError(res.error || "Gagal mengubah fase ke Penjurian Ahli.");
    } else {
      setActiveStage("PENJURIAN_AHLI");
    }
  }

  async function confirmSelectFinalists() {
    setPendingConfirmAction(null);
    setIsSubmitting(true);
    setActionError(null);
    const res = await selectFinalistsAction(data.id);
    setIsSubmitting(false);
    if (!res.success) {
      setActionError(res.error || "Gagal memilih finalis.");
    } else {
      setActiveStage("PITCHING_FINAL");
    }
  }

  async function confirmAnnounceWinner() {
    setPendingConfirmAction(null);
    setIsSubmitting(true);
    setActionError(null);
    const res = await announceWinnerAction(data.id);
    setIsSubmitting(false);
    if (!res.success) {
      setActionError(res.error || "Gagal mengumumkan pemenang.");
    } else {
      setActiveStage("PENGUMUMAN_PEMENANG");
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#171717] text-white">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-7 pt-5 pb-16">
        
        {/* Real Phase Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#191919] border border-[#303030] rounded-xl px-4 py-3 mb-5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E30000] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-semibold text-white text-xs">
                Status Database: <span className="uppercase text-[#E30000]">{data.status}</span>
              </span>
              <span className="text-[#A4A4A4] text-[11px]">
                {data.status === "ongoing" && "Menerima submission peserta"}
                {data.status === "judging" && "Tahap Penjurian Ahli berlangsung"}
                {data.status === "final_pitch" && "Tahap Pitching Final berlangsung"}
                {data.status === "completed" && "Kompetisi Selesai & Pemenang diumumkan"}
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            {actionError && (
              <span className="text-red-400 text-[11px] mr-2">{actionError}</span>
            )}

            {data.status === "ongoing" && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPendingConfirmAction("judging")}
                className="px-3.5 py-1.5 rounded-lg bg-[#E30000] hover:bg-[#C00000] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
                <span>Mulai Penjurian Ahli</span>
              </button>
            )}

            {data.status === "judging" && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPendingConfirmAction("finalists")}
                className="px-3.5 py-1.5 rounded-lg bg-[#E30000] hover:bg-[#C00000] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>Pilih Top 3 Finalist</span>
              </button>
            )}

            {/* Fallback: challenge sudah final_pitch tapi finalis belum terpilih */}
            {data.status === "final_pitch" && data.pitchingEntries.length === 0 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPendingConfirmAction("finalists")}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>Pilih Finalist (Perbaiki)</span>
              </button>
            )}

            {data.status === "final_pitch" && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPendingConfirmAction("winner")}
                className="px-3.5 py-1.5 rounded-lg bg-[#F0B90B] hover:bg-[#D9A60A] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Trophy size={13} />}
                <span>Umumkan Pemenang</span>
              </button>
            )}

            {data.status === "completed" && (
              <span className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-600/60 text-emerald-300 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Kompetisi Selesai</span>
              </span>
            )}
          </div>
        </div>

        {/* ── Stage Tab Preview Switcher ────────────────────────── */}
        <div className="flex items-center justify-between gap-3 bg-[#202020] border border-[#333] rounded-lg px-3.5 py-1.5 mb-5 text-xs text-[#A4A4A4]">
          <span className="font-medium text-[#A4A4A4] text-[11px]">Tampilan Tab:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                ["PENJURIAN_AHLI", "1. Penjurian Ahli"],
                ["PITCHING_FINAL", "2. Pitching Final"],
                ["PENGUMUMAN_PEMENANG", "3. Pemenang"],
              ] as const
            ).map(([stageKey, label]) => {
              const isSelected = activeStage === stageKey;
              return (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => setActiveStage(stageKey)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? "bg-[#E30000] text-white font-bold"
                      : "bg-[#2A2829] text-[#A4A4A4] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Summary Header ────────────────────────────────────── */}
        <ManageChallengeHeader data={data} stage={activeStage} />

        {/* ── Primary 3-Tab Navigation Bar ─────────────────────── */}
        <div className="h-[48px] border-b border-[#393939] flex items-stretch gap-7 sm:gap-8 mt-6">
          <button
            type="button"
            onClick={() => setPrimaryTab("assessment")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "assessment"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Penilaian &amp; Pemenang
          </button>

          <button
            type="button"
            onClick={() => setPrimaryTab("discussion")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "discussion"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Ruang Diskusi
          </button>

          <button
            type="button"
            onClick={() => setPrimaryTab("settings")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "settings"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Pengaturan Challenge
          </button>
        </div>

        {/* ── Tab Content Area ─────────────────────────────────── */}
        {primaryTab === "assessment" && (
          <AssessmentSubmenu data={data} stage={activeStage} />
        )}

        {primaryTab === "discussion" && (
          <DiscussionTab
            challengeId={data.id}
            companyName={data.companyName ?? "Penyelenggara"}
          />
        )}

        {primaryTab === "settings" && (
          <ChallengeSettingsTab challengeId={data.id} data={data} />
        )}
      </div>

      {/* ── Confirmation Modals via Portal ────────────────── */}
      {mounted &&
        pendingConfirmAction !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setPendingConfirmAction(null)}
          >
            <div
              className="bg-[#202020] border border-[#3A3A3A] rounded-[18px] max-w-md w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-150 z-[9999] pointer-events-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#303030]">
                <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-[#E30000]" />
                  {pendingConfirmAction === "judging" && "Mulai Penjurian Ahli?"}
                  {pendingConfirmAction === "finalists" && "Pilih Top 3 Finalist?"}
                  {pendingConfirmAction === "winner" && "Umumkan Pemenang Resmi?"}
                </h3>
                <button
                  type="button"
                  onClick={() => setPendingConfirmAction(null)}
                  className="text-[#A4A4A4] hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-[13px] text-[#D0D0D0] leading-[1.6]">
                  {pendingConfirmAction === "judging" &&
                    "Apakah Anda yakin ingin memindahkan fase ke Penjurian Ahli? Peserta yang belum mengirimkan submission solusi akan dieliminasi secara otomatis."}
                  {pendingConfirmAction === "finalists" &&
                    "Apakah Anda yakin ingin memilih Top 3 Finalist berdasarkan kalkulasi nilai Penjurian Ahli? Peserta lain akan tereliminasi secara otomatis."}
                  {pendingConfirmAction === "winner" &&
                    "Apakah Anda yakin ingin mengumumkan pemenang resmi? Nilai akhir (Penjurian Ahli + Pitching Final) akan dihitung, peringkat 1-3 ditetapkan, serta sertifikat dan hadiah akan diberikan."}
                </p>

                <div className="bg-[rgba(227,0,0,0.1)] border border-[rgba(227,0,0,0.3)] rounded-[12px] p-3 text-[12px] text-red-300 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-[#E30000] flex-shrink-0 mt-0.5" />
                  <p className="font-medium">
                    Perhatian: Perubahan fase kompetisi ini akan memperbarui status peserta di database dan mengirimkan notifikasi.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#303030]">
                <button
                  type="button"
                  onClick={() => setPendingConfirmAction(null)}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-full border border-[#444] text-[12px] font-semibold text-[#A4A4A4] hover:text-white hover:bg-[#303030] transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={
                    pendingConfirmAction === "judging"
                      ? confirmMoveToJudging
                      : pendingConfirmAction === "finalists"
                      ? confirmSelectFinalists
                      : confirmAnnounceWinner
                  }
                  disabled={isSubmitting}
                  className="h-9 px-5 rounded-full bg-[#E30000] hover:bg-[#C00000] text-white text-[12px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : "Ya, Lanjutkan"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
