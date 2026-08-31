import type { ChallengeStage } from "@/lib/data/dashboard";

const STAGES: { id: ChallengeStage | string; label: string }[] = [
  { id: "submitted",     label: "Terkirim"  },
  { id: "screening",     label: "Screening" },
  { id: "expert-review", label: "Ahli"      },
  { id: "result",        label: "Hasil"     },
];

const STAGE_ORDER: Record<string, number> = {
  submitted:     0,
  screening:     1,
  "expert-review": 2,
  result:        3,
};

interface ChallengeStageProgressProps {
  currentStage: ChallengeStage;
}

export default function ChallengeStageProgress({ currentStage }: ChallengeStageProgressProps) {
  const currentIndex = STAGE_ORDER[currentStage] ?? 0;

  return (
    <div className="grid grid-cols-4 gap-1.5 mb-3.5">
      {STAGES.map(({ id, label }, idx) => {
        const isDone = idx <= currentIndex;

        return (
          <div key={id} className="flex flex-col gap-1.5 min-w-0">
            {/* Label */}
            <span
              className={[
                "text-[11px] text-center truncate leading-none",
                isDone ? "font-semibold text-gray-900" : "font-medium text-gray-400",
              ].join(" ")}
              title={label}
            >
              {label}
            </span>
            {/* Segment bar */}
            <div
              className={[
                "h-[3px] rounded-full w-full",
                isDone ? "bg-gray-900" : "bg-gray-200",
              ].join(" ")}
            />
          </div>
        );
      })}
    </div>
  );
}