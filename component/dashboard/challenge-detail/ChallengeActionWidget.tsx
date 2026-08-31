// ChallengeActionWidget.tsx — 11-state machine
// Single component; switch on `state` prop.
"use client";

import { useState } from "react";
import {
  Upload, Link2, ChevronDown, AlertCircle, CheckCircle2,
  Clock, Trophy, Info, Users, AlertTriangle
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────
export type ChallengeActionState =
  | "ACTIVE_NOT_JOINED"
  | "ACTIVE_JOINED_TEAM_LEADER"
  | "ACTIVE_JOINED_INDIVIDUAL"
  | "ACTIVE_JOINED_TEAM_MEMBER"
  | "CLOSED_NOT_JOINED"
  | "ENDED_NOT_JOINED"
  | "CLOSED_JOINED"
  | "CLOSED_FAILED_EXPERT_REVIEW"
  | "CLOSED_PASSED_EXPERT_REVIEW"
  | "CLOSED_FAILED_FINAL_PITCHING"
  | "CLOSED_WINNER";

export interface ChallengeActionWidgetProps {
  challengeId: string;
  state: ChallengeActionState;
  teamName?: string;
  winnerName?: string;
}

// ── Mock score data ─────────────────────────────────────────
const EXPERT_SCORES = [
  { label: "Kelayakan Teknis", score: 85 },
  { label: "Inovasi & Orisinalitas", score: 78 },
  { label: "Dampak & Skalabilitas", score: 90 },
];
const FULL_SCORES = [
  ...EXPERT_SCORES,
  { label: "Biaya & Sumber Daya", score: 82 },
  { label: "Kesiapan Implementasi", score: 88 },
  { label: "Kejelasan Model", score: 75 },
];
const OVERALL_SCORE = 83;

// ── Inner atoms ─────────────────────────────────────────────

function UploadZone({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={[
        "mt-3.5 min-h-[80px] border border-dashed rounded-[12px] flex flex-col items-center justify-center text-center p-3.5 transition-colors",
        enabled
          ? "bg-gray-50 border-gray-300 hover:bg-secondary-50 hover:border-primary-300 cursor-pointer"
          : "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed",
      ].join(" ")}
    >
      <Upload
        size={22}
        className={enabled ? "text-primary-500" : "text-gray-400"}
        strokeWidth={1.6}
      />
      <p className={`text-[12px] font-semibold mt-1.5 ${enabled ? "text-gray-800" : "text-gray-400"}`}>
        {enabled ? "Upload Dokumen Inovasi" : "Upload tidak tersedia"}
      </p>
      <p className={`text-[11px] mt-0.5 ${enabled ? "text-gray-500" : "text-gray-400"}`}>
        {enabled ? "PDF, DOCX, ZIP — maks. 20 MB" : "Hanya Ketua Tim yang dapat mengunggah"}
      </p>
    </div>
  );
}

function SubmissionInput({ value, onChange, readOnly = false }: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-semibold text-gray-700 mb-1.5">Tautan Submission</p>
      <div className="relative">
        <Link2
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          strokeWidth={1.8}
        />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder="https://drive.google.com/..."
          className={[
            "w-full h-[38px] rounded-full pl-8 pr-3 text-[11px] border outline-none transition-all",
            readOnly
              ? "bg-white border-primary-400 text-primary-500 cursor-default"
              : "bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function AgreementNotice({ agreed, onChange, disabled = false }: {
  agreed: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[10px] p-2.5 mt-3.5 flex gap-2",
        disabled ? "bg-gray-100" : "bg-secondary-50",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="w-3.5 h-3.5 rounded accent-primary-500 mt-0.5 flex-shrink-0"
      />
      <p className={`text-[11px] leading-[1.45] ${disabled ? "text-gray-500" : "text-gray-700"}`}>
        Saya menyetujui{" "}
        <a href="#" className="text-primary-500 font-bold underline">
          Ketentuan Hak Cipta
        </a>{" "}
        dan memastikan bahwa inovasi yang dikumpulkan adalah karya original.
      </p>
    </div>
  );
}

function StatusBanner({
  type,
  text,
}: {
  type: "warning" | "danger" | "success" | "info" | "winner";
  text: string;
}) {
  const styles: Record<string, { bg: string; text: string; icon: typeof AlertCircle }> = {
    warning:  { bg: "bg-[#FFF9E8] text-[#A96F00]", text: "text-gray-800", icon: Clock },
    danger:   { bg: "bg-primary-50 text-primary-500", text: "text-primary-600", icon: AlertCircle },
    success:  { bg: "bg-[#E4F4E6] text-[#168A39]", text: "text-[#168A39]", icon: CheckCircle2 },
    info:     { bg: "bg-[#FFF9E8] text-[#A96F00]", text: "text-gray-800", icon: Info },
    winner:   { bg: "bg-primary-500 text-white", text: "text-white", icon: Trophy },
  };
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div className={`rounded-[10px] p-2.5 flex items-start gap-2 ${s.bg}`}>
      <Icon size={14} strokeWidth={1.8} className="flex-shrink-0 mt-0.5" />
      <p className={`text-[11px] leading-[1.45] font-medium ${s.text}`}>{text}</p>
    </div>
  );
}

function ScorePanel({ scores }: { scores: { label: string; score: number }[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] p-2.5 mt-3">
      <p className="text-[12px] font-bold text-gray-800 mb-2">Hasil Penilaian</p>
      {scores.map(({ label, score }) => (
        <div
          key={label}
          className="flex items-center justify-between h-8 bg-[#E4F4E6] rounded-full px-2.5 mb-1.5"
        >
          <span className="text-[10px] font-medium text-gray-800">{label}</span>
          <span className="text-[16px] font-bold text-[#168A39]">{score}</span>
        </div>
      ))}
      <div className="flex items-center justify-between h-9 bg-gray-200 rounded-full px-3 mt-2">
        <span className="text-[12px] font-semibold text-gray-700">Nilai Keseluruhan</span>
        <span className="text-[18px] font-bold text-gray-800">{OVERALL_SCORE}</span>
      </div>
    </div>
  );
}

function PrimaryButton({
  label,
  disabled = false,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full h-10 rounded-full text-[12px] font-bold transition-colors mt-3",
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ── Widget header ───────────────────────────────────────────
const JOINED_STATES: ChallengeActionState[] = [
  "ACTIVE_JOINED_TEAM_LEADER",
  "ACTIVE_JOINED_INDIVIDUAL",
  "ACTIVE_JOINED_TEAM_MEMBER",
  "CLOSED_JOINED",
  "CLOSED_FAILED_EXPERT_REVIEW",
  "CLOSED_PASSED_EXPERT_REVIEW",
  "CLOSED_FAILED_FINAL_PITCHING",
  "CLOSED_WINNER",
];
const TEAM_STATES: ChallengeActionState[] = [
  "ACTIVE_JOINED_TEAM_LEADER",
  "ACTIVE_JOINED_TEAM_MEMBER",
  "CLOSED_JOINED",
  "CLOSED_FAILED_EXPERT_REVIEW",
  "CLOSED_PASSED_EXPERT_REVIEW",
  "CLOSED_FAILED_FINAL_PITCHING",
  "CLOSED_WINNER",
];

function WidgetHeader({ state, teamName }: { state: ChallengeActionState; teamName: string }) {
  const showTabs = JOINED_STATES.includes(state);
  const teamTabActive = TEAM_STATES.includes(state);
  const individualTabActive = state === "ACTIVE_JOINED_INDIVIDUAL";
  const showTeamSelector = TEAM_STATES.includes(state);

  const tabBase =
    "inline-flex items-center h-7 px-2.5 rounded-full text-[11px] font-semibold transition-colors";
  const tabActive = "bg-white text-primary-500";
  const tabInactive = "text-white border border-white/45 hover:bg-white/10";

  return (
    <div
      className="flex items-center justify-between h-11 px-2.5"
      style={{ background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)" }}
    >
      {showTabs ? (
        <div className="flex items-center gap-1">
          <button type="button" className={`${tabBase} ${teamTabActive ? tabActive : tabInactive}`}>
            Tim
          </button>
          <button type="button" className={`${tabBase} ${individualTabActive ? tabActive : tabInactive}`}>
            Individu
          </button>
        </div>
      ) : (
        <span className="text-[12px] font-semibold text-white/80">Partisipasi</span>
      )}

      {showTeamSelector && (
        <div className="flex items-center gap-1 text-white text-[11px] font-semibold">
          <Users size={11} strokeWidth={2} />
          {teamName}
          <ChevronDown size={11} strokeWidth={2} />
        </div>
      )}
    </div>
  );
}

// ── Main widget ─────────────────────────────────────────────
export default function ChallengeActionWidget({
  challengeId: _challengeId,
  state,
  teamName = "Inovasi Nusantara",
  winnerName = "Irfan Satya",
}: ChallengeActionWidgetProps) {
  const [agreed, setAgreed] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");

  // States where no widget shell is needed
  if (state === "ENDED_NOT_JOINED") {
    return (
      <div
        className="rounded-[14px] overflow-hidden border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.035)]"
      >
        <div
          className="p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)" }}
        >
          <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center text-primary-500 text-[11px] font-bold select-none flex-shrink-0">
            IS
          </div>
          <div>
            <p className="text-[10px] text-white/78 leading-none mb-0.5">Pemenang Challenge ini adalah</p>
            <p className="text-[15px] font-bold text-white leading-tight">{winnerName}</p>
          </div>
          <Trophy size={20} className="text-white/70 ml-auto" strokeWidth={1.6} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">

      {/* Stable red header */}
      <WidgetHeader state={state} teamName={teamName} />

      {/* State-specific body */}
      <div className="p-4">
        {(() => {
          switch (state) {

            // ── 1. Active, not joined ────────────────────────
            case "ACTIVE_NOT_JOINED":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Ikuti Challenge</h3>
                  <p className="text-[12px] text-gray-600 leading-[1.55] mt-1.5">
                    Daftarkan diri anda dan mulai kerjakan inovasi terbaik untuk challenge ini. Solver terpilih akan mendapat hadiah dan sertifikat resmi.
                  </p>
                  <PrimaryButton label="Ikuti Challenge" />
                  <button
                    type="button"
                    className="w-full h-10 rounded-full text-[12px] font-semibold bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors mt-2"
                  >
                    Lihat Kesepakatan Hak Cipta
                  </button>
                </>
              );

            // ── 2. Active, joined, team leader ──────────────
            case "ACTIVE_JOINED_TEAM_LEADER":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Kumpulkan Inovasi Anda</h3>
                  <p className="text-[12px] text-gray-600 leading-[1.55] mt-1.5">
                    Upload dokumen atau tambahkan tautan submission anda sebagai Ketua Tim.
                  </p>
                  <UploadZone enabled />
                  <SubmissionInput value={submissionUrl} onChange={setSubmissionUrl} />
                  <AgreementNotice agreed={agreed} onChange={setAgreed} />
                  <PrimaryButton label="Submit Inovasi" disabled={!agreed} />
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Submission hanya dapat dilakukan 1 kali.
                  </p>
                </>
              );

            // ── 3. Active, joined, individual ───────────────
            case "ACTIVE_JOINED_INDIVIDUAL":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Kumpulkan Inovasi Anda</h3>
                  <p className="text-[12px] text-gray-600 leading-[1.55] mt-1.5">
                    Upload dokumen atau tambahkan tautan submission anda sebagai peserta individu.
                  </p>
                  <UploadZone enabled />
                  <SubmissionInput value={submissionUrl} onChange={setSubmissionUrl} />
                  <AgreementNotice agreed={agreed} onChange={setAgreed} />
                  <PrimaryButton label="Submit Inovasi" disabled={!agreed} />
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Submission hanya dapat dilakukan 1 kali.
                  </p>
                </>
              );

            // ── 4. Active, joined, team member (read-only) ──
            case "ACTIVE_JOINED_TEAM_MEMBER":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Kumpulkan Inovasi</h3>
                  <UploadZone enabled={false} />
                  <div className="mt-3.5">
                    <StatusBanner
                      type="info"
                      text="Anda sedang mengikuti challenge ini sebagai Anggota Tim. Submission hanya dapat dilakukan oleh Ketua Tim."
                    />
                  </div>
                  <AgreementNotice agreed={false} disabled />
                  <PrimaryButton label="Submit Inovasi" disabled />
                </>
              );

            // ── 5. Closed, not joined ────────────────────────
            case "CLOSED_NOT_JOINED":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Pendaftaran Ditutup</h3>
                  <div className="mt-3">
                    <StatusBanner
                      type="warning"
                      text="Anda tidak mengikuti challenge ini. Pendaftaran telah ditutup dan tidak dapat lagi diikuti."
                    />
                  </div>
                </>
              );

            // ── 6. Closed, joined, in queue ─────────────────
            case "CLOSED_JOINED":
              return (
                <>
                  <h3 className="text-[15px] font-bold text-gray-900">Menunggu Penilaian</h3>
                  <div className="mt-3">
                    <StatusBanner
                      type="warning"
                      text="Inovasi anda sudah masuk ke dalam antrian penilaian. Tunggu hingga hasil penilaian keluar."
                    />
                  </div>
                  <SubmissionInput
                    value="https://drive.google.com/file/inovasi-saya"
                    readOnly
                  />
                  <AgreementNotice agreed disabled />
                  <PrimaryButton label="Buka Tautan" />
                </>
              );

            // ── 7. Closed, failed expert review ─────────────
            case "CLOSED_FAILED_EXPERT_REVIEW":
              return (
                <>
                  <StatusBanner
                    type="danger"
                    text="Mohon maaf, anda tidak lolos seleksi tahap Penjurian Ahli. Silahkan lihat hasil penilaian inovasi anda."
                  />
                  <SubmissionInput
                    value="https://drive.google.com/file/inovasi-saya"
                    readOnly
                  />
                  <AgreementNotice agreed disabled />
                  <PrimaryButton label="Buka Tautan" />
                  <ScorePanel scores={EXPERT_SCORES} />
                </>
              );

            // ── 8. Closed, passed expert review ─────────────
            case "CLOSED_PASSED_EXPERT_REVIEW":
              return (
                <>
                  <StatusBanner
                    type="success"
                    text="Selamat, anda lolos seleksi tahap Penjurian Ahli. Cek Email / WhatsApp anda untuk mendapat jadwal dan detail Pitching Final dengan juri."
                  />
                  <SubmissionInput
                    value="https://drive.google.com/file/inovasi-saya"
                    readOnly
                  />
                  <AgreementNotice agreed disabled />
                  <PrimaryButton label="Buka Tautan" />
                  <ScorePanel scores={EXPERT_SCORES} />
                </>
              );

            // ── 9. Closed, failed final pitching ────────────
            case "CLOSED_FAILED_FINAL_PITCHING":
              return (
                <>
                  <StatusBanner
                    type="danger"
                    text="Mohon maaf, anda tidak lolos seleksi tahap Pitching Final. Silahkan lihat hasil penilaian inovasi anda."
                  />
                  <SubmissionInput
                    value="https://drive.google.com/file/inovasi-saya"
                    readOnly
                  />
                  <AgreementNotice agreed disabled />
                  <PrimaryButton label="Buka Tautan" />
                  <ScorePanel scores={FULL_SCORES} />
                </>
              );

            // ── 10. Closed, winner ───────────────────────────
            case "CLOSED_WINNER":
              return (
                <>
                  {/* Winner banner */}
                  <div
                    className="-mx-4 -mt-4 mb-4 p-4 flex items-center gap-3"
                    style={{ background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)" }}
                  >
                    <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center text-primary-500 text-[11px] font-bold select-none flex-shrink-0">
                      {winnerName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[10px] text-white/78 leading-none mb-0.5">
                        Pemenang Challenge ini adalah
                      </p>
                      <p className="text-[15px] font-bold text-white leading-tight">{winnerName}</p>
                    </div>
                    <Trophy size={18} className="text-white/70 ml-auto flex-shrink-0" strokeWidth={1.6} />
                  </div>

                  {/* Success status */}
                  <StatusBanner
                    type="success"
                    text="Selamat, inovasi Anda terpilih menjadi pemenang di Challenge ini. Hadiah beserta sertifikat resmi telah dikirimkan ke menu Perolehan."
                  />
                  <SubmissionInput
                    value="https://drive.google.com/file/inovasi-saya"
                    readOnly
                  />
                  <AgreementNotice agreed disabled />
                  <PrimaryButton label="Buka Tautan" />
                  <ScorePanel scores={FULL_SCORES} />
                </>
              );

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}