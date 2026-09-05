// component/dashboard/challenge-detail/ScorePanel.tsx
// Panel nilai penjurian — ditampilkan di sidebar kanan setelah solver submit solusi.
// Abu-abu = belum dinilai, Hijau = sudah ada nilai.

import { AlertCircle } from "lucide-react";

export interface ScoreCriterion {
  id: string;
  name: string;
  stage: "expert_judging" | "final_pitch";
  score: number | null;   // null = belum dinilai
  maxScore?: number;      // default 100
}

export interface ScorePanelProps {
  criteria: ScoreCriterion[];
  expertWeight: number; // 0-100
  pitchWeight: number;  // 0-100
  /** false = sedang menunggu penilaian, true = semua skor sudah masuk */
  isFullyJudged?: boolean;
}

function ScoreBar({ score, maxScore = 100, judged }: { score: number; maxScore?: number; judged: boolean }) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  return (
    <div className="w-full h-[6px] rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${judged ? "bg-[#168A39]" : "bg-gray-300"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StageSection({
  label,
  stageCriteria,
  isPending,
}: {
  label: string;
  stageCriteria: ScoreCriterion[];
  isPending: boolean;
}) {
  const total = stageCriteria.reduce((sum, c) => sum + (c.score ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Hasil Penilaian</p>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>

      <div className="space-y-3">
        {stageCriteria.map((c) => {
          const judged = !isPending && c.score !== null;
          const displayScore = c.score ?? 0;
          const maxScore = c.maxScore ?? 100;

          return (
            <div key={c.id}>
              <div className="flex items-end justify-between mb-1">
                <span
                  className={`text-[22px] font-bold leading-none ${
                    judged ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {displayScore}
                  <span className={`text-[12px] font-normal ml-1 ${judged ? "text-gray-500" : "text-gray-400"}`}>
                    dari {maxScore}
                  </span>
                </span>
              </div>
              <ScoreBar score={displayScore} maxScore={maxScore} judged={judged} />
              <p className={`text-[11px] mt-1 ${judged ? "text-gray-600" : "text-gray-400"}`}>{c.name}</p>
            </div>
          );
        })}
      </div>

      {/* Total per stage */}
      <div
        className={`mt-3 flex items-center justify-between rounded-[10px] px-3.5 py-2.5 ${
          isPending ? "bg-gray-100" : "bg-gray-900"
        }`}
      >
        <span className={`text-[13px] font-semibold ${isPending ? "text-gray-400" : "text-white"}`}>
          {total}
        </span>
        <span className={`text-[11px] font-bold ${isPending ? "text-gray-400" : "text-white"}`}>
          Total Nilai
        </span>
      </div>
    </div>
  );
}

export default function ScorePanel({
  criteria,
  expertWeight,
  pitchWeight,
  isFullyJudged = false,
}: ScorePanelProps) {
  const expertCriteria = criteria.filter((c) => c.stage === "expert_judging");
  const pitchCriteria  = criteria.filter((c) => c.stage === "final_pitch");

  const expertTotal = expertCriteria.reduce((s, c) => s + (c.score ?? 0), 0);
  const pitchTotal  = pitchCriteria.reduce((s, c) => s + (c.score ?? 0), 0);

  const finalScore =
    isFullyJudged
      ? Math.round((expertTotal * expertWeight + pitchTotal * pitchWeight) / 100)
      : 0;

  const isPending = !isFullyJudged;

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      {/* Header */}
      <div
        className="flex items-center justify-between h-11 px-3.5"
        style={{ background: "linear-gradient(100deg, #E9201E 0%, #220000 100%)" }}
      >
        <span className="text-[12px] font-bold text-white">Hasil Penilaian</span>
        {isPending && (
          <span className="text-[10px] font-semibold text-white/70">Menunggu juri</span>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Pending notice */}
        {isPending && (
          <div className="rounded-[12px] p-3 flex items-start gap-2.5 bg-[#FFF9E8] border border-[#FBE3B5]">
            <AlertCircle size={15} className="text-[#D9822B] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-[1.5] font-medium text-[#8C6210]">
              Nilai masih belum diinput dan sedang menunggu proses penilaian dewan juri.
            </p>
          </div>
        )}

        {/* Expert Judging section */}
        {expertCriteria.length > 0 && (
          <StageSection
            label="Penjurian Ahli"
            stageCriteria={expertCriteria}
            isPending={isPending}
          />
        )}

        {/* Divider */}
        {expertCriteria.length > 0 && pitchCriteria.length > 0 && (
          <div className="h-px bg-gray-100" />
        )}

        {/* Final Pitch section */}
        {pitchCriteria.length > 0 && (
          <StageSection
            label="Pitching Final"
            stageCriteria={pitchCriteria}
            isPending={isPending}
          />
        )}

        {/* Final Score */}
        {(expertCriteria.length > 0 || pitchCriteria.length > 0) && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className={`text-[18px] font-bold ${isPending ? "text-gray-400" : "text-gray-900"}`}>
                Nilai Akhir
              </span>
              <span className={`text-[22px] font-black ${isPending ? "text-gray-300" : "text-gray-900"}`}>
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
