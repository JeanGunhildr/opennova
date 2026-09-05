"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trophy,
  Users,
  AlertTriangle,
  X,
  User,
  Users2,
  Trash2,
} from "lucide-react";
import {
  joinChallengeAction,
  cancelJoinChallengeAction,
  submitChallengeDriveUrlAction,
} from "@/lib/actions/challenge";

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

export interface CaptainTeamOption {
  id: string;
  name: string;
  memberCount: number;
}

export interface ChallengeActionWidgetProps {
  challengeId: string;
  initialState: ChallengeActionState;
  teamName?: string;
  winnerName?: string;
  captainTeams?: CaptainTeamOption[];
  existingSubmissionUrl?: string | null;
}

function StatusBanner({
  type,
  text,
}: {
  type: "warning" | "danger" | "success" | "info" | "winner";
  text: string;
}) {
  const styles: Record<
    string,
    { bg: string; text: string; icon: typeof AlertCircle }
  > = {
    warning: {
      bg: "bg-[#FFF9E8] border border-[#FBE3B5] text-[#8C6210]",
      text: "text-[#8C6210]",
      icon: Clock,
    },
    danger: {
      bg: "bg-red-50 border border-red-200 text-red-700",
      text: "text-red-700",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-[#E4F4E6] border border-[#C3E8C7] text-[#168A39]",
      text: "text-[#168A39]",
      icon: CheckCircle2,
    },
    info: {
      bg: "bg-[#FFF8E6] border border-[#FBE3B5] text-[#8C6210]",
      text: "text-[#8C6210]",
      icon: AlertTriangle,
    },
    winner: {
      bg: "bg-primary-500 text-white",
      text: "text-white",
      icon: Trophy,
    },
  };
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div className={`rounded-[12px] p-3 flex items-start gap-2.5 ${s.bg}`}>
      <Icon size={16} strokeWidth={1.8} className="flex-shrink-0 mt-0.5" />
      <p className={`text-[12px] leading-[1.5] font-medium ${s.text}`}>
        {text}
      </p>
    </div>
  );
}

export default function ChallengeActionWidget({
  challengeId,
  initialState,
  teamName: initialTeamName = "",
  winnerName = "Irfan Satya",
  captainTeams = [],
  existingSubmissionUrl = "",
}: ChallengeActionWidgetProps) {
  const router = useRouter();
  const [state, setState] = useState<ChallengeActionState>(initialState);
  const [teamName, setTeamName] = useState(initialTeamName);
  const [submissionUrl, setSubmissionUrl] = useState(
    existingSubmissionUrl || "",
  );
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);

  // Join options & Modal state
  const [isJoining, setIsJoining] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(
    captainTeams[0]?.id || "",
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Checkbox agreement state
  const [agreed, setAgreed] = useState(false);

  // Handle Join Individu
  const handleJoinIndividual = async () => {
    setIsJoining(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await joinChallengeAction(challengeId, "individual");
    setIsJoining(false);

    if (res.success) {
      setState("ACTIVE_JOINED_INDIVIDUAL");
      setActionSuccess("Berhasil bergabung secara Individu!");
      router.refresh();
    } else {
      setActionError(res.error || "Gagal mendaftar secara individu.");
    }
  };

  // Handle Join Tim
  const handleJoinTeam = async () => {
    if (!selectedTeamId) {
      setActionError("Pilih tim terlebih dahulu.");
      return;
    }

    setIsJoining(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await joinChallengeAction(challengeId, "team", selectedTeamId);
    setIsJoining(false);
    setShowTeamModal(false);

    if (res.success) {
      const selectedTeam = captainTeams.find((t) => t.id === selectedTeamId);
      setTeamName(selectedTeam?.name || "Tim Anda");
      setState("ACTIVE_JOINED_TEAM_LEADER");
      setActionSuccess(`Berhasil mendaftarkan tim ${selectedTeam?.name}!`);
      router.refresh();
    } else {
      setActionError(res.error || "Gagal mendaftar bersama tim.");
    }
  };

  // Handle Batal Bergabung (Cancel Entry)
  const handleCancelJoin = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin membatalkan pendaftaran pada challenge ini?",
      )
    )
      return;

    setIsJoining(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await cancelJoinChallengeAction(challengeId);
    setIsJoining(false);

    if (res.success) {
      setState("ACTIVE_NOT_JOINED");
      setActionSuccess("Pendaftaran telah dibatalkan.");
      router.refresh();
    } else {
      setActionError(res.error || "Gagal membatalkan pendaftaran.");
    }
  };

  // Handle Submit Drive Link
  const handleSubmitDriveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) {
      setActionError(
        "Masukkan tautan Google Drive submission terlebih dahulu.",
      );
      return;
    }

    setIsSubmittingUrl(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await submitChallengeDriveUrlAction(challengeId, submissionUrl);
    setIsSubmittingUrl(false);

    if (res.success) {
      setActionSuccess("Tautan submission Google Drive berhasil disimpan!");
      router.refresh();
    } else {
      setActionError(res.error || "Gagal menyimpan tautan submission.");
    }
  };

  // States where winner info is displayed directly
  if (state === "ENDED_NOT_JOINED") {
    return (
      <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-xs p-4">
        <div
          className="rounded-[12px] p-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)",
          }}
        >
          <div className="w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center text-primary-500 text-[11px] font-bold select-none flex-shrink-0">
            {winnerName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-[10px] text-white/80 leading-none mb-0.5">
              Pemenang Challenge ini adalah
            </p>
            <p className="text-[15px] font-bold text-white leading-tight">
              {winnerName}
            </p>
          </div>
          <Trophy
            size={20}
            className="text-white/80 ml-auto"
            strokeWidth={1.8}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      {/* ── Widget Red Banner Header ───────────────────────── */}
      <div
        className="flex items-center justify-between h-11 px-3.5"
        style={{
          background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)",
        }}
      >
        <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
          <Trophy size={14} className="text-white/90" />
          Status Partisipasi
        </span>
        {state === "ACTIVE_JOINED_TEAM_LEADER" ||
        state === "ACTIVE_JOINED_TEAM_MEMBER" ? (
          <span className="inline-flex items-center gap-1 text-white text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
            <Users size={12} />
            {teamName || "Tim"}
          </span>
        ) : state === "ACTIVE_JOINED_INDIVIDUAL" ? (
          <span className="inline-flex items-center gap-1 text-white text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
            <User size={12} />
            Individu
          </span>
        ) : null}
      </div>

      {/* ── Action Box Body ───────────────────────────────── */}
      <div className="p-4 space-y-3.5">
        {/* Error / Success Feedback Notifications */}
        {actionError && (
          <div className="p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-[12px] flex items-center justify-between">
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError(null)}>
              <X size={14} />
            </button>
          </div>
        )}
        {actionSuccess && (
          <div className="p-2.5 rounded-[10px] bg-[#E4F4E6] border border-[#C3E8C7] text-[#168A39] text-[12px] flex items-center justify-between">
            <span>{actionSuccess}</span>
            <button type="button" onClick={() => setActionSuccess(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── 1. State: ACTIVE_NOT_JOINED (Opsi Bergabung) ── */}
        {state === "ACTIVE_NOT_JOINED" && (
          <div>
            <h3 className="text-[14.5px] font-bold text-gray-900 mb-1">
              Opsi Opsi Bergabung
            </h3>
            <p className="text-[12px] text-gray-600 leading-[1.55] mb-3.5">
              Pilih mode pendaftaran untuk mulai mengerjakan tantangan ini.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Tombol Join Individu */}
              <button
                type="button"
                onClick={handleJoinIndividual}
                disabled={isJoining}
                className="h-[40px] px-3 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <User size={14} />
                Individu
              </button>

              {/* Tombol Join Tim */}
              <button
                type="button"
                onClick={() => setShowTeamModal(true)}
                disabled={isJoining}
                className="h-[40px] px-3 rounded-full bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <Users2 size={14} />
                Gabung Tim
              </button>
            </div>
          </div>
        )}

        {/* ── 2. State: ACTIVE_JOINED_INDIVIDUAL ───────────── */}
        {state === "ACTIVE_JOINED_INDIVIDUAL" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14.5px] font-bold text-gray-900">
                Submission Individu
              </h3>
              {/* Hanya tampilkan tombol batal jika belum submit */}
              {!existingSubmissionUrl && (
                <button
                  type="button"
                  onClick={handleCancelJoin}
                  disabled={isJoining}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  <Trash2 size={12} />
                  Batal Bergabung
                </button>
              )}
            </div>

            {/* ── Sudah submit: tampilkan link readonly + Buka Tautan ── */}
            {submissionUrl ? (
              <div className="space-y-3">
                <StatusBanner
                  type="warning"
                  text="Inovasi anda sudah masuk ke dalam antrian penilaian. Tunggu hingga hasil penilaian keluar."
                />

                {/* Checkbox agreement (readonly, sudah dicentang) */}
                <div className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded-[10px]">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-3.5 h-3.5 rounded accent-primary-500 mt-0.5 flex-shrink-0"
                  />
                  <label className="text-[11px] text-gray-700 leading-[1.4]">
                    Saya menyetujui{" "}
                    <strong className="font-bold underline">
                      Kesepakatan Hak Cipta Inovasi
                    </strong>{" "}
                    Opennova, termasuk mekanisme kepemilikan solusi apabila
                    terpilih sebagai pemenang.
                  </label>
                </div>

                {/* Link submission */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    Tautan Hasil Inovasi
                  </p>
                  <div className="w-full h-[38px] rounded-full px-3.5 border border-primary-400 bg-primary-50/30 text-primary-600 text-[12px] font-medium flex items-center gap-2 overflow-hidden">
                    <Link2
                      size={13}
                      className="flex-shrink-0 text-primary-500"
                    />
                    <span className="truncate">{submissionUrl}</span>
                  </div>
                </div>

                <a
                  href={submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[38px] rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold transition-all"
                >
                  Buka Tautan →
                </a>
              </div>
            ) : (
              /* ── Belum submit: tampilkan form input ── */
              <form onSubmit={handleSubmitDriveUrl} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Tautan Google Drive Submission
                  </label>
                  <div className="relative">
                    <Link2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full h-[38px] rounded-full pl-8 pr-3 text-[12px] border border-gray-300 bg-white text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Pastikan izin akses tautan Google Drive telah diubah menjadi
                    &quot;Siapa saja yang memiliki link&quot;.
                  </p>
                </div>

                {/* Checkbox Hak Cipta */}
                <div className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded-[10px]">
                  <input
                    type="checkbox"
                    id="agree-ind"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-primary-500 mt-0.5 flex-shrink-0"
                  />
                  <label
                    htmlFor="agree-ind"
                    className="text-[11px] text-gray-700 leading-[1.4] cursor-pointer"
                  >
                    Saya menyetujui{" "}
                    <strong className="font-bold underline">
                      Kesepakatan Hak Cipta Inovasi
                    </strong>{" "}
                    Opennova, termasuk mekanisme kepemilikan solusi apabila
                    terpilih sebagai pemenang.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agreed || isSubmittingUrl}
                  className="w-full h-[38px] rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {isSubmittingUrl ? "Menyimpan..." : "Kirim Submission"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── 3. State: ACTIVE_JOINED_TEAM_LEADER ──────────── */}
        {state === "ACTIVE_JOINED_TEAM_LEADER" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14.5px] font-bold text-gray-900">
                Submission Ketua Tim
              </h3>
              {!existingSubmissionUrl && (
                <button
                  type="button"
                  onClick={handleCancelJoin}
                  disabled={isJoining}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  <Trash2 size={12} />
                  Batal Bergabung
                </button>
              )}
            </div>

            <p className="text-[11.5px] text-gray-600 mb-2">
              Anda terdaftar sebagai Ketua Tim{" "}
              <span className="font-bold text-gray-900">{teamName}</span>.
            </p>

            {/* ── Sudah submit: tampilkan link readonly + Buka Tautan ── */}
            {submissionUrl ? (
              <div className="space-y-3">
                <StatusBanner
                  type="warning"
                  text="Inovasi anda sudah masuk ke dalam antrian penilaian. Tunggu hingga hasil penilaian keluar."
                />

                {/* Checkbox agreement (readonly) */}
                <div className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded-[10px]">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-3.5 h-3.5 rounded accent-primary-500 mt-0.5 flex-shrink-0"
                  />
                  <label className="text-[11px] text-gray-700 leading-[1.4]">
                    Saya menyetujui{" "}
                    <strong className="font-bold underline">
                      Kesepakatan Hak Cipta Inovasi
                    </strong>{" "}
                    Opennova, termasuk mekanisme kepemilikan solusi apabila
                    terpilih sebagai pemenang.
                  </label>
                </div>

                {/* Link submission */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    Tautan Hasil Inovasi
                  </p>
                  <div className="w-full h-[38px] rounded-full px-3.5 border border-primary-400 bg-primary-50/30 text-primary-600 text-[12px] font-medium flex items-center gap-2 overflow-hidden">
                    <Link2
                      size={13}
                      className="flex-shrink-0 text-primary-500"
                    />
                    <span className="truncate">{submissionUrl}</span>
                  </div>
                </div>

                <a
                  href={submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[38px] rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold transition-all"
                >
                  Buka Tautan →
                </a>
              </div>
            ) : (
              /* ── Belum submit: tampilkan form input ── */
              <form onSubmit={handleSubmitDriveUrl} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Tautan Google Drive Submission Tim
                  </label>
                  <div className="relative">
                    <Link2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full h-[38px] rounded-full pl-8 pr-3 text-[12px] border border-gray-300 bg-white text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Pastikan izin akses tautan Google Drive telah diubah menjadi
                    &quot;Siapa saja yang memiliki link&quot;.
                  </p>
                </div>

                {/* Checkbox Hak Cipta */}
                <div className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded-[10px]">
                  <input
                    type="checkbox"
                    id="agree-team"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-primary-500 mt-0.5 flex-shrink-0"
                  />
                  <label
                    htmlFor="agree-team"
                    className="text-[11px] text-gray-700 leading-[1.4] cursor-pointer"
                  >
                    Saya menyetujui{" "}
                    <strong className="font-bold underline">
                      Kesepakatan Hak Cipta Inovasi
                    </strong>{" "}
                    Opennova, termasuk mekanisme kepemilikan solusi apabila
                    terpilih sebagai pemenang.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agreed || isSubmittingUrl}
                  className="w-full h-[38px] rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {isSubmittingUrl ? "Menyimpan..." : "Kirim Submission Tim"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── 4. State: ACTIVE_JOINED_TEAM_MEMBER ──────────── */}
        {/* ── 4. State: ACTIVE_JOINED_TEAM_MEMBER ──────────── */}
        {state === "ACTIVE_JOINED_TEAM_MEMBER" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2
                size={17}
                className="text-[#168A39]"
                strokeWidth={2}
              />

              <h3 className="text-[14.5px] font-bold text-gray-900">
                Anda Telah Terdaftar
              </h3>
            </div>

            <div className="rounded-[12px] border border-[#C3E8C7] bg-[#E4F4E6] p-3.5">
              <p className="text-[12px] text-[#168A39] leading-[1.55]">
                Anda telah terdaftar pada challenge ini dengan tim{" "}
                <span className="font-bold">{teamName || "Tim Anda"}</span>.
              </p>

              <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-[#C3E8C7]">
                <Users size={13} className="text-[#168A39] flex-shrink-0" />

                <p className="text-[11px] text-[#168A39]">
                  Submission hanya dapat dilakukan oleh Ketua Tim.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. State: CLOSED_NOT_JOINED ───────────────────── */}
        {state === "CLOSED_NOT_JOINED" && (
          <StatusBanner
            type="warning"
            text="Anda tidak mengikuti challenge ini. Pendaftaran telah ditutup."
          />
        )}
      </div>

      {/* ── Modal Pilih Tim (Khusus Ketua Tim) ────────────────── */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-md w-full p-5 shadow-xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                <Users2 size={18} className="text-primary-500" />
                Pilih Tim untuk Daftar
              </h3>
              <button
                type="button"
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {/* Notice Warning Khusus Ketua Tim */}
              <div className="bg-[#FFF8E6] border border-[#FBE3B5] rounded-[12px] p-3 text-[12px] text-[#8C6210] flex items-start gap-2.5">
                <AlertTriangle
                  size={16}
                  className="text-[#D9822B] flex-shrink-0 mt-0.5"
                />
                <p>
                  <strong className="font-bold">Perhatian:</strong> Hanya Ketua
                  Tim yang dapat mendaftarkan tim untuk kategori tim. Tim yang
                  terpilih opsi-opsinya di bawah ini adalah tim yang mana Anda
                  menjabat sebagai Ketua.
                </p>
              </div>

              {captainTeams.length === 0 ? (
                <div className="text-center py-5 bg-gray-50 border border-gray-200 rounded-[14px]">
                  <p className="text-[13px] font-medium text-gray-700">
                    Anda tidak memiliki tim aktif di mana Anda menjadi Ketua.
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Buat tim baru di menu &quot;Tim Anda&quot; untuk mendaftar
                    sebagai tim.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-gray-700">
                    Pilih Tim Saya:
                  </label>
                  {captainTeams.map((team) => (
                    <label
                      key={team.id}
                      className={`flex items-center justify-between p-3 rounded-[12px] border cursor-pointer transition-all ${
                        selectedTeamId === team.id
                          ? "border-primary-500 bg-primary-50/40 text-primary-900"
                          : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="selected-team"
                          value={team.id}
                          checked={selectedTeamId === team.id}
                          onChange={() => setSelectedTeamId(team.id)}
                          className="accent-primary-500"
                        />
                        <div>
                          <p className="text-[13px] font-bold">{team.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {team.memberCount} anggota aktif
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                        Ketua Tim
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowTeamModal(false)}
                className="h-9 px-4 rounded-full border border-gray-300 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              {captainTeams.length > 0 && (
                <button
                  type="button"
                  onClick={handleJoinTeam}
                  disabled={isJoining}
                  className="h-9 px-5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold transition-colors disabled:opacity-50"
                >
                  {isJoining ? "Mendaftarkan..." : "Daftarkan Tim"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
