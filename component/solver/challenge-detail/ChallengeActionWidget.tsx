"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Users,
  User,
  Info,
  Check,
} from "lucide-react";
import type { ResolvedChallengeUI, ChallengeState } from "@/lib/data/challengeState";

const MOCK_TEAMS = [
  { id: "team-1", name: "Blater Child" },
  { id: "team-2", name: "Nova Vanguard" },
  { id: "team-3", name: "Inovator Soedirman" },
];

interface ChallengeActionWidgetProps {
  state: ChallengeState;
  resolved: ResolvedChallengeUI;
  onOpenCopyrightModal: () => void;
  onOpenWithdrawModal: () => void;
  onJoinChallenge?: () => void;
  onSubmitInnovation?: (url: string) => void;
}

export default function ChallengeActionWidget({
  state,
  resolved,
  onOpenCopyrightModal,
  onOpenWithdrawModal,
  onJoinChallenge,
  onSubmitInnovation,
}: ChallengeActionWidgetProps) {
  const [driveUrl, setDriveUrl] = useState(state.submissionUrl || "");
  const [agreed, setAgreed] = useState(false);
  const [activeRole, setActiveRole] = useState<"team" | "individual">(
    state.participationStatus === "INDIVIDUAL" ? "individual" : "team"
  );
  const [selectedTeam, setSelectedTeam] = useState(
    state.teamName || MOCK_TEAMS[0].name
  );
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(!!state.submissionUrl);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync activeRole and selectedTeam when scenario or state prop changes
  useEffect(() => {
    setActiveRole(state.participationStatus === "INDIVIDUAL" ? "individual" : "team");
    setSelectedTeam(state.teamName || MOCK_TEAMS[0].name);
    setDriveUrl(state.submissionUrl || "");
    setSubmitted(!!state.submissionUrl);
    setIsTeamDropdownOpen(false);
  }, [state.scenarioId, state.participationStatus, state.teamName, state.submissionUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
    };
    if (isTeamDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTeamDropdownOpen]);

  // Check toggle permission: ONLY editable in Condition 2 & 3
  const canToggleParticipation =
    state.scenarioId === "ACTIVE_JOINED_TEAM_LEADER" ||
    state.scenarioId === "ACTIVE_JOINED_INDIVIDUAL";

  const displayUrl = submitted ? driveUrl || state.submissionUrl : state.submissionUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim() || !agreed) return;
    setSubmitted(true);
    if (onSubmitInnovation) onSubmitInnovation(driveUrl);
  };

  // Expert criteria list and sum
  const expertCriteriaList =
    state.expertCriteriaScores && state.expertCriteriaScores.length > 0
      ? state.expertCriteriaScores
      : [
          { name: "Kelayakan Teknis", score: 80 },
          { name: "Inovasi & Orisinalitas", score: 78 },
          { name: "Dampak & Skalabilitas", score: 80 },
        ];
  const expertTotalScore =
    state.expertScore ??
    expertCriteriaList.reduce((sum, item) => sum + item.score, 0);

  // Pitching criteria list and sum
  const pitchingCriteriaList =
    state.pitchingCriteriaScores && state.pitchingCriteriaScores.length > 0
      ? state.pitchingCriteriaScores
      : [
          { name: "Biaya & Sumber Daya", score: 80 },
          { name: "Kesiapan Implementasi", score: 80 },
          { name: "Kejelasan Model", score: 80 },
        ];
  const pitchingTotalScore =
    state.pitchingScore ??
    pitchingCriteriaList.reduce((sum, item) => sum + item.score, 0);

  // Check if both phases are active
  const hasDualPhases =
    state.expertJudgingStatus !== "NOT_STARTED" &&
    state.finalPitchingStatus !== "NOT_STARTED";

  // Calculate weighted final score
  const finalCalculatedScore = hasDualPhases
    ? resolved.finalScore ??
      Math.round((expertTotalScore * 0.6 + pitchingTotalScore * 0.4) * 10) / 10
    : expertTotalScore;

  // Helper renderer for header switcher & team dropdown
  const renderHeaderBar = () => (
    <div
      className="relative h-[44px] px-3 flex items-center justify-between"
      style={{
        background: "linear-gradient(100deg, #E30000 0%, #240000 100%)",
      }}
      ref={dropdownRef}
    >
      {/* Left: Switcher pills */}
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            if (canToggleParticipation) {
              setActiveRole("team");
            }
          }}
          className={`h-[28px] px-3 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1 ${
            !canToggleParticipation ? "pointer-events-none cursor-default" : "cursor-pointer"
          } ${
            activeRole === "team"
              ? "bg-white text-[#E30000] shadow-sm"
              : "bg-transparent border border-white/45 text-white hover:border-white"
          }`}
        >
          <Users size={12} strokeWidth={2} />
          Tim
        </button>
        <button
          type="button"
          onClick={() => {
            if (canToggleParticipation) {
              setActiveRole("individual");
              setIsTeamDropdownOpen(false);
            }
          }}
          className={`h-[28px] px-3 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1 ${
            !canToggleParticipation ? "pointer-events-none cursor-default" : "cursor-pointer"
          } ${
            activeRole === "individual"
              ? "bg-white text-[#E30000] shadow-sm"
              : "bg-transparent border border-white/45 text-white hover:border-white"
          }`}
        >
          <User size={12} strokeWidth={2} />
          Individu
        </button>
      </div>

      {/* Right: Team dropdown (visible ONLY when activeRole === "team") */}
      {activeRole === "team" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (canToggleParticipation) {
                setIsTeamDropdownOpen((prev) => !prev);
              }
            }}
            className={`text-white text-[11px] font-semibold flex items-center gap-1 select-none ${
              !canToggleParticipation ? "pointer-events-none cursor-default" : "cursor-pointer hover:text-white/90"
            }`}
          >
            <span className="truncate max-w-[130px]">{selectedTeam}</span>
            <ChevronDown
              size={13}
              className={`text-white/80 transition-transform duration-150 ${
                isTeamDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {isTeamDropdownOpen && canToggleParticipation && (
            <div className="absolute right-0 top-8 z-30 min-w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-xs text-gray-800 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Pilih Tim
              </div>
              {MOCK_TEAMS.map((t) => {
                const isSelected = t.name === selectedTeam;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeam(t.name);
                      setIsTeamDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-[11px] transition-colors ${
                      isSelected
                        ? "bg-red-50 text-[#E30000] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 font-normal"
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    {isSelected && <Check size={13} className="text-[#E30000] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ═════════════════════════════════════════════════════════════════════════
  // MODE A: EVALUATION RESULTS EXIST (DUAL OR SINGLE EVALUATION CARDS)
  // ═════════════════════════════════════════════════════════════════════════
  if (resolved.expertResultAvailable || resolved.pitchingResultAvailable) {
    const isFailed =
      state.finalPitchingStatus === "FAILED" || state.expertJudgingStatus === "FAILED";

    return (
      <div className="w-full flex flex-col">
        {/* ── CARD 1: Action / Submission Card ─────────────────── */}
        <div className="w-full bg-white rounded-[14px] shadow-sm overflow-visible">
          {/* Header (44px gradient) */}
          {renderHeaderBar()}

          {/* Body */}
          <div className="p-3.5 space-y-3 bg-white rounded-b-[14px] border border-t-0 border-gray-200">
            {/* Alert Banner */}
            {isFailed ? (
              <div className="bg-[#FFF2F2] border border-[#F9CCCC] rounded-[10px] p-3 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-[#CC0000] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-[#CC0000] font-medium">
                  {state.expertJudgingStatus === "FAILED"
                    ? "Mohon maaf, anda tidak lolos seleksi tahap Penjurian Ahli. Silahkan lihat hasil penilaian inovasi anda di bawah ini."
                    : "Mohon maaf, anda tidak lolos seleksi tahap Pitching Final. Silahkan lihat hasil penilaian inovasi anda di bawah ini."}
                </span>
              </div>
            ) : (
              <div className="bg-[#E8F8EE] border border-[#C6F0D4] rounded-[10px] p-3 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-[#15803D] font-medium">
                  {state.userIsWinner
                    ? "Selamat, inovasi Anda terpilih menjadi pemenang di Challenge ini. Hadiah beserta sertifikat resmi telah dikirimkan ke menu Perolehan."
                    : "Selamat, anda lolos seleksi tahap Penjurian Ahli. Cek Email / WhatsApp anda untuk mendapat jadwal dan detail Pitching Final dengan juri."}
                </span>
              </div>
            )}

            {/* Agreement Box */}
            <div className="bg-gray-100/70 rounded-[10px] p-2.5 flex items-start gap-2 text-[10px] text-gray-600 leading-normal">
              <input
                type="checkbox"
                id="agreement-checked"
                checked
                readOnly
                className="accent-gray-700 mt-0.5 cursor-default w-3.5 h-3.5"
              />
              <label htmlFor="agreement-checked" className="cursor-pointer select-none">
                Saya menyetujui{" "}
                <button
                  type="button"
                  onClick={onOpenCopyrightModal}
                  className="text-[#E30000] font-bold underline hover:text-[#CC0000]"
                >
                  Kesepakatan Hak Cipta Inovasi
                </button>{" "}
                yang berlaku.
              </label>
            </div>

            {/* Tautan Hasil Inovasi */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-800 block">
                Tautan Hasil Inovasi
              </label>
              <div className="rounded-full border border-red-400 bg-white px-3 py-2 text-[11px] text-red-500 truncate block">
                {displayUrl || "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026"}
              </div>
            </div>

            {/* Buka Tautan Button */}
            <a
              href={displayUrl || "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[40px] rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              Buka Tautan →
            </a>
          </div>
        </div>

        {/* ── CARD A: Hasil Penilaian (PENJURIAN AHLI) ─────────── */}
        {resolved.expertResultAvailable && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-3.5 space-y-3.5 shadow-sm mt-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900">
                Hasil Penilaian
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                PENJURIAN AHLI
              </span>
            </div>

            {/* Criteria Items with progress bar */}
            <div className="space-y-3">
              {expertCriteriaList.map((crit, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-gray-900 leading-none">
                      {crit.score}
                    </span>
                    <span className="text-[10px] font-semibold text-green-600">
                      dari 100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden my-1">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, crit.score))}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 block">
                    {crit.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Nilai Pill */}
            <div className="w-full bg-[#1E2329] text-white rounded-full px-4 py-2 flex items-center justify-between mt-3">
              <span className="text-base font-bold text-white">{expertTotalScore}</span>
              <span className="text-[11px] font-medium text-gray-300">Total Nilai</span>
            </div>

            {/* Optional feedback note */}
            {state.expertFeedback && (
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed italic border-t border-gray-100 pt-2">
                &ldquo;{state.expertFeedback}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* ── CARD B: Hasil Penilaian (PITCHING FINAL) ─────────── */}
        {resolved.pitchingResultAvailable && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-3.5 space-y-3.5 shadow-sm mt-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900">
                Hasil Penilaian
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                PITCHING FINAL
              </span>
            </div>

            {/* Criteria Items with progress bar */}
            <div className="space-y-3">
              {pitchingCriteriaList.map((crit, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-gray-900 leading-none">
                      {crit.score}
                    </span>
                    <span className="text-[10px] font-semibold text-green-600">
                      dari 100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden my-1">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, crit.score))}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 block">
                    {crit.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Nilai Pill */}
            <div className="w-full bg-[#1E2329] text-white rounded-full px-4 py-2 flex items-center justify-between mt-3">
              <span className="text-base font-bold text-white">{pitchingTotalScore}</span>
              <span className="text-[11px] font-medium text-gray-300">Total Nilai</span>
            </div>

            {/* Optional feedback note */}
            {state.pitchingFeedback && (
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed italic border-t border-gray-100 pt-2">
                &ldquo;{state.pitchingFeedback}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* ── CARD 3: Nilai Akhir Card with Formula Sub-Footer ── */}
        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-sm mt-3.5">
          {/* Top Section */}
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Nilai Akhir</span>
            <span className="text-xl font-bold text-gray-900">{finalCalculatedScore}</span>
          </div>

          {/* Bottom Sub-Footer Bar */}
          <div className="bg-gray-100/90 border-t border-gray-200/80 py-2 px-3 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              {hasDualPhases
                ? "PENJURIAN AHLI (60%) + PITCHING FINAL (40%)"
                : "PENJURIAN AHLI (100%)"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MODE B: PRE-EVALUATION / SUBMISSION / NOT JOINED STATES
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className={`w-full bg-white border border-gray-200 rounded-[14px] shadow-[0_1px_3px_rgba(17,24,39,0.04)] ${
      resolved.joined ? "overflow-visible" : "overflow-hidden"
    }`}>
      {/* Header with Gradient (Rendered when joined) */}
      {resolved.joined && (
        <div className="rounded-t-[14px] overflow-hidden">
          {renderHeaderBar()}
        </div>
      )}

      {/* Body Content */}
      <div className="p-[15px] flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 leading-[1.3]">
          {resolved.joined ? "Pengumpulan Inovasi" : "Partisipasi Challenge"}
        </h3>
        <p className="text-[12px] leading-[1.55] text-gray-600 mt-1.5">
          {resolved.joined
            ? "Kumpulkan tautan folder Google Drive yang memuat seluruh dokumen dan materi solusi inovasi."
            : "Bergabunglah sekarang untuk mengumpulkan solusi dan berkompetisi memperebutkan hadiah."}
        </p>

        {/* Status Banners */}
        <div className="mt-3">
          {resolved.registrationClosed && resolved.joined && (
            <div className="rounded-[10px] p-[11px_12px] text-[11px] leading-[1.5] mb-3 flex items-start gap-2 border bg-[#FFFBEB] border-[#FEF5D8] text-[#D97706]">
              <Clock size={16} className="text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Menunggu Penilaian</strong>
                Inovasi anda sudah masuk ke dalam antrian penilaian. Tunggu hingga hasil penilaian keluar.
              </div>
            </div>
          )}

          {resolved.teamMemberRestricted && resolved.registrationOpen && (
            <div className="rounded-[10px] p-[11px_12px] text-[11px] leading-[1.5] mb-3 flex items-start gap-2 border bg-[#FFFBEB] border-[#FEF5D8] text-gray-800">
              <Info size={16} className="text-[#E30000] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Hak Akses Terbatas</strong>
                Hanya ketua tim yang dapat mengumpulkan inovasi.
              </div>
            </div>
          )}

          {resolved.registrationClosed && !resolved.joined && (
            <div className="rounded-[10px] p-[11px_12px] text-[11px] leading-[1.5] mb-3 flex items-start gap-2 border bg-[#FFFBEB] border-[#FEF5D8] text-gray-800">
              <Info size={16} className="text-[#E30000] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Pendaftaran Ditutup</strong>
                Pendaftaran telah ditutup.
              </div>
            </div>
          )}
        </div>

        {/* Form Submission Controls (When Active & Joined without submission) */}
        {resolved.registrationOpen && resolved.joined && !displayUrl && (
          <form onSubmit={handleSubmit} className="mt-[13px] flex flex-col">
            <div>
              <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">
                Tautan Hasil Inovasi
              </label>
              <input
                type="url"
                required
                disabled={resolved.teamMemberRestricted}
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="h-[38px] w-full rounded-full border border-gray-300 px-3 text-[11px] text-gray-800 placeholder:text-gray-400 focus:border-[#E30000] focus:ring-2 focus:ring-[#E30000]/15 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-white"
              />
              <p className="text-[10px] text-gray-500 text-center mt-1">
                Submission hanya dapat dilakukan 1 kali.
              </p>
            </div>

            {/* Copyright Agreement Box */}
            <div className="mt-3 p-2.5 rounded-[10px] bg-[#FFF8F7] flex items-start gap-2 text-[10px] text-gray-600 border border-[#FFE0DC]">
              <input
                type="checkbox"
                id="copyright-check-normal"
                disabled={resolved.teamMemberRestricted}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-[#E30000] mt-0.5 w-[14px] h-[14px] cursor-pointer disabled:cursor-not-allowed"
              />
              <label
                htmlFor="copyright-check-normal"
                className="text-[10px] leading-[1.45] text-gray-600 cursor-pointer select-none"
              >
                Saya menyetujui{" "}
                <button
                  type="button"
                  onClick={onOpenCopyrightModal}
                  className="text-[#E30000] font-bold underline hover:text-[#CC0000]"
                >
                  Kesepakatan Hak Cipta Inovasi
                </button>{" "}
                yang berlaku.
              </label>
            </div>

            {/* Submit Button */}
            {resolved.teamMemberRestricted ? (
              <button
                type="button"
                disabled
                className="h-[40px] w-full rounded-full bg-gray-200 border border-gray-300 text-gray-500 text-[12px] font-semibold cursor-not-allowed mt-3"
              >
                Submit Inovasi
              </button>
            ) : (
              <button
                type="submit"
                disabled={!driveUrl.trim() || !agreed}
                className="h-[40px] w-full rounded-full bg-[#E30000] hover:bg-[#CC0000] disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-500 text-white text-[12px] font-bold mt-3 transition-colors shadow-sm disabled:cursor-not-allowed"
              >
                Submit Inovasi
              </button>
            )}

            {/* Withdraw Ghost Button */}
            <button
              type="button"
              onClick={onOpenWithdrawModal}
              className="h-[34px] w-full rounded-full text-gray-500 hover:text-red-600 text-[11px] font-semibold mt-2 transition-colors flex items-center justify-center"
            >
              Batal Ikuti Challenge
            </button>
          </form>
        )}

        {/* Submitted Link Display (Before results released) */}
        {displayUrl && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[11px] font-semibold text-gray-700">
              Tautan Hasil Inovasi
            </span>
            <div className="h-[38px] w-full rounded-full border border-red-300 px-3 text-[10px] text-[#E30000] flex items-center justify-between truncate bg-white">
              <span className="truncate max-w-[200px]">{displayUrl}</span>
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E30000] hover:text-[#CC0000] p-1 flex-shrink-0"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-full rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[12px] font-bold mt-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              Buka Tautan →
            </a>

            {resolved.registrationOpen && (
              <button
                type="button"
                onClick={onOpenWithdrawModal}
                className="h-[34px] w-full rounded-full text-gray-500 hover:text-red-600 text-[11px] font-semibold mt-2 transition-colors flex items-center justify-center"
              >
                Batal Ikuti Challenge
              </button>
            )}
          </div>
        )}

        {/* Not Joined Actions */}
        {!resolved.joined && resolved.registrationOpen && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={onOpenCopyrightModal}
              className="h-[38px] w-full rounded-full bg-white border border-gray-300 text-gray-800 text-[12px] font-semibold mt-3 hover:bg-gray-50 transition-colors"
            >
              Lihat Kesepakatan Hak Cipta
            </button>
            <button
              type="button"
              onClick={onJoinChallenge}
              className="h-[40px] w-full rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[12px] font-bold mt-2 transition-colors shadow-sm"
            >
              Ikuti Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
