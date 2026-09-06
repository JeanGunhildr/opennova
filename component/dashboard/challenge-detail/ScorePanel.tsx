// component/dashboard/challenge-detail/ScorePanel.tsx
// Panel nilai penjurian — ditampilkan di sidebar kanan setelah solver bergabung/submit solusi.
// Abu-abu & "0 / 0" = belum dinilai, Hijau & "X / 100" = sudah ada nilai.

import { AlertCircle, CheckCircle2, Trophy, Info, XCircle } from "lucide-react";

export interface ScoreCriterion {
  id: string;
  name: string;
  stage: "expert_judging" | "final_pitch";
  score: number | null; // null = belum dinilai
  maxScore?: number; // 100 jika sudah dinilai, 0 jika belum dinilai
}

export interface ScorePanelProps {
  criteria: ScoreCriterion[];
  expertWeight: number; // 0-100
  pitchWeight: number; // 0-100
  /** false = sedang menunggu penilaian, true = semua skor sudah masuk */
  isFullyJudged?: boolean;
  entryStatus?: string; // registered | submitted | finalist | winner | eliminated
  isWinner?: boolean;
  challengeStatus?: string; // ongoing | judging | final_pitch | completed
  hasSubmission?: boolean;
}

function ScoreBar({
  score,
  maxScore = 100,
  judged,
}: {
  score: number;
  maxScore?: number;
  judged: boolean;
}) {
  const pct =
    maxScore > 0 ? Math.min(100, Math.max(0, (score / maxScore) * 100)) : 0;
  return (
    <div className="w-full h-[6px] rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          judged ? "bg-[#168A39]" : "bg-gray-300"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StageSection({
  label,
  stageCriteria,
}: {
  label: string;
  stageCriteria: ScoreCriterion[];
}) {
  const scoredItems = stageCriteria.filter((c) => c.score !== null);
  const totalScore = scoredItems.reduce((sum, c) => sum + (c.score ?? 0), 0);
  const hasScores = scoredItems.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
          Hasil Penilaian
        </p>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="space-y-3.5">
        {stageCriteria.map((c) => {
          const judged = c.score !== null;
          const displayScore = c.score ?? 0;
          const maxScore = judged ? (c.maxScore ?? 100) : 0;

          return (
            <div key={c.id}>
              <div className="flex items-end justify-between mb-1">
                <span
                  className={`text-[20px] font-bold leading-none ${
                    judged ? "text-[#168A39]" : "text-gray-400"
                  }`}
                >
                  {displayScore}
                  <span
                    className={`text-[12px] font-normal ml-1 ${
                      judged ? "text-[#168A39]/80" : "text-gray-400"
                    }`}
                  >
                    / {maxScore}
                  </span>
                </span>
              </div>
              <ScoreBar
                score={displayScore}
                maxScore={maxScore}
                judged={judged}
              />
              <p
                className={`text-[11px] mt-1 leading-snug ${
                  judged ? "text-gray-800 font-semibold" : "text-gray-400"
                }`}
              >
                {c.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Total per stage */}
      <div
        className={`mt-3.5 flex items-center justify-between rounded-[10px] px-3.5 py-2.5 transition-colors ${
          hasScores ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <span
          className={`text-[13px] font-semibold ${
            hasScores ? "text-white" : "text-gray-400"
          }`}
        >
          {totalScore}
        </span>
        <span
          className={`text-[11px] font-bold ${
            hasScores ? "text-white" : "text-gray-400"
          }`}
        >
          Total Nilai
        </span>
      </div>
    </div>
  );
}

interface ResultNotification {
  title: string;
  message: string;
  type: "winner" | "success" | "warning" | "info" | "neutral" | "danger";
}

function getResultNotification({
  criteria,
  entryStatus = "registered",
  isWinner = false,
  challengeStatus = "ongoing",
  hasSubmission = false,
}: {
  criteria: ScoreCriterion[];
  entryStatus?: string;
  isWinner?: boolean;
  challengeStatus?: string;
  hasSubmission?: boolean;
}): ResultNotification {
  const expertCriteria = criteria.filter((c) => c.stage === "expert_judging");
  const pitchCriteria = criteria.filter((c) => c.stage === "final_pitch");

  const expertScoredCount = expertCriteria.filter(
    (c) => c.score !== null,
  ).length;
  const isExpertFullyJudged =
    expertCriteria.length > 0 && expertScoredCount === expertCriteria.length;

  const pitchScoredCount = pitchCriteria.filter((c) => c.score !== null).length;
  const isPitchFullyJudged =
    pitchCriteria.length > 0 && pitchScoredCount === pitchCriteria.length;

  const chStatus = (challengeStatus || "").toLowerCase();
  const isCompleted = chStatus === "completed";
  const isFinalPitchStage = chStatus === "final_pitch";
  const isJudgingStage = chStatus === "judging";

  // Priority 1: Winner / Menang
  if (isWinner || entryStatus === "winner") {
    return {
      title: "Pemenang Challenge! 🏆",
      message: "Selamat! Anda terpilih sebagai pemenang challenge ini.",
      type: "winner",
    };
  }

  // Priority 2: Lolos Final Pitch tetapi Tidak Menang (Challenge Completed)
  if (
    isCompleted &&
    (entryStatus === "finalist" || pitchScoredCount > 0) &&
    !isWinner
  ) {
    return {
      title: "Hasil Akhir Kompetisi",
      message:
        "Anda berhasil lolos Final Pitch, tetapi belum terpilih sebagai pemenang.",
      type: "neutral",
    };
  }

  // Priority 3: Tidak Lolos / Gagal Lolos ke Final Pitch
  if (
    entryStatus === "eliminated" ||
    ((isFinalPitchStage || isCompleted) &&
      entryStatus !== "finalist" &&
      entryStatus !== "winner" &&
      !isWinner)
  ) {
    return {
      title: "Hasil Seleksi",
      message: "Anda belum lolos ke tahap Final Pitch.",
      type: "danger",
    };
  }

  // Priority 4: Lolos Final Pitch
  if (entryStatus === "finalist") {
    if (isPitchFullyJudged) {
      return {
        title: "Tahap Final Pitch Selesai",
        message:
          "Selamat! Anda berhasil menyelesaikan tahap Final Pitch. Hasil akhir sedang menunggu pengumuman.",
        type: "success",
      };
    }
    return {
      title: "Lolos Ke Final Pitch! 🎉",
      message: "Selamat! Anda lolos ke tahap Final Pitch.",
      type: "success",
    };
  }

  // Priority 5: Expert Judging Selesai, Menunggu Final Pitch
  if (
    isExpertFullyJudged &&
    (isJudgingStage || isFinalPitchStage || entryStatus === "submitted")
  ) {
    return {
      title: "Penjurian Ahli Selesai",
      message:
        "Penilaian Expert Judging telah selesai. Menunggu hasil seleksi Final Pitch.",
      type: "info",
    };
  }

  // Priority 6: Sudah Submit tetapi Belum Selesai Dinilai
  if (hasSubmission) {
    if (expertScoredCount > 0) {
      return {
        title: "Penilaian Berlangsung",
        message:
          "Sebagian kriteria Penjurian Ahli telah dinilai. Proses penilaian oleh dewan juri masih berlangsung.",
        type: "info",
      };
    }
    return {
      title: "Menunggu Penilaian",
      message:
        "Submission Anda telah diterima. Nilai masih dalam proses penilaian oleh dewan juri.",
      type: "warning",
    };
  }

  // Priority 7: Belum Ada Submission
  return {
    title: "Belum Mengirim Submission",
    message:
      "Kirimkan submission solusi Anda sebelum batas waktu untuk dinilai dewan juri.",
    type: "neutral",
  };
}

export default function ScorePanel({
  criteria,
  expertWeight,
  pitchWeight,
  isFullyJudged = false,
  entryStatus = "registered",
  isWinner = false,
  challengeStatus = "ongoing",
  hasSubmission = false,
}: ScorePanelProps) {
  const expertCriteria = criteria.filter((c) => c.stage === "expert_judging");
  const pitchCriteria = criteria.filter((c) => c.stage === "final_pitch");

  // Calculate total final score from all judged criteria.
  // Unjudged criteria contribute 0.
  const expertTotal = expertCriteria.reduce(
    (sum, c) => sum + (c.score ?? 0),
    0,
  );

  const pitchTotal = pitchCriteria.reduce((sum, c) => sum + (c.score ?? 0), 0);

  const finalScore = expertTotal + pitchTotal;

  const notification = getResultNotification({
    criteria,
    entryStatus,
    isWinner,
    challengeStatus,
    hasSubmission,
  });

  const getNotificationBannerStyle = (type: ResultNotification["type"]) => {
    switch (type) {
      case "winner":
        return {
          container: "bg-[#FFFBEB] border-[#FCD34D]",
          icon: (
            <Trophy size={16} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          ),
          title: "text-[#92400E]",
          text: "text-[#B45309]",
        };
      case "success":
        return {
          container: "bg-[#F0FDF4] border-[#86EFAC]",
          icon: (
            <CheckCircle2
              size={16}
              className="text-[#16A34A] flex-shrink-0 mt-0.5"
            />
          ),
          title: "text-[#166534]",
          text: "text-[#15803D]",
        };
      case "warning":
        return {
          container: "bg-[#FFF9E8] border-[#FBE3B5]",
          icon: (
            <AlertCircle
              size={16}
              className="text-[#D9822B] flex-shrink-0 mt-0.5"
            />
          ),
          title: "text-[#8C6210]",
          text: "text-[#8C6210]",
        };
      case "danger":
        return {
          container: "bg-[#FEF2F2] border-[#FCA5A5]",
          icon: (
            <XCircle
              size={16}
              className="text-[#DC2626] flex-shrink-0 mt-0.5"
            />
          ),
          title: "text-[#991B1B]",
          text: "text-[#B91C1C]",
        };
      case "info":
        return {
          container: "bg-[#EFF6FF] border-[#BFDBFE]",
          icon: (
            <Info size={16} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
          ),
          title: "text-[#1E40AF]",
          text: "text-[#1D4ED8]",
        };
      case "neutral":
      default:
        return {
          container: "bg-[#F9FAFB] border-[#E5E7EB]",
          icon: (
            <Info size={16} className="text-[#6B7280] flex-shrink-0 mt-0.5" />
          ),
          title: "text-[#374151]",
          text: "text-[#4B5563]",
        };
    }
  };

  const bannerStyle = getNotificationBannerStyle(notification.type);

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      {/* Header */}
      <div
        className="flex items-center justify-between h-11 px-3.5"
        style={{
          background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)",
        }}
      >
        <span className="text-[12px] font-bold text-white">
          Hasil Penilaian
        </span>
        {!isFullyJudged && (
          <span className="text-[10px] font-semibold text-white/70">
            Proses penilaian
          </span>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Dynamic Notification Banner */}
        <div
          className={`rounded-[12px] p-3 flex items-start gap-2.5 border ${bannerStyle.container}`}
        >
          {bannerStyle.icon}
          <div className="flex flex-col gap-0.5">
            <span className={`text-[12px] font-bold ${bannerStyle.title}`}>
              {notification.title}
            </span>
            <p
              className={`text-[11px] leading-[1.5] font-medium ${bannerStyle.text}`}
            >
              {notification.message}
            </p>
          </div>
        </div>

        {/* Expert Judging section */}
        {expertCriteria.length > 0 && (
          <StageSection label="Penjurian Ahli" stageCriteria={expertCriteria} />
        )}

        {/* Divider */}
        {expertCriteria.length > 0 && pitchCriteria.length > 0 && (
          <div className="h-px bg-gray-100" />
        )}

        {/* Final Pitch section */}
        {pitchCriteria.length > 0 && (
          <StageSection label="Pitching Final" stageCriteria={pitchCriteria} />
        )}

        {/* Final Score */}
        {(expertCriteria.length > 0 || pitchCriteria.length > 0) && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-gray-900">
                Nilai Akhir
              </span>
              <span className="text-[22px] font-black text-gray-900">
                {finalScore}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
              Penjurian Ahli ({expertWeight}%) + Pitching Final ({pitchWeight}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
