import { Check, X } from "lucide-react";

type PillTone = "gray" | "blue" | "amber" | "green" | "red";

const TONE_STYLES: Record<PillTone, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
};

export function StatusPill({
  label,
  tone = "gray",
}: {
  label: string;
  tone?: PillTone;
}) {
  return (
    <span
      className={[
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold",
        TONE_STYLES[tone],
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function BooleanMark({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
      <Check size={14} strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-500">
      <X size={14} strokeWidth={3} />
    </span>
  );
}

export function activeChallengeStatusTone(
  status: string
): PillTone {
  switch (status) {
    case "Challenge Dibuka":
      return "blue";
    case "Penjurian Ahli":
      return "amber";
    case "Pitching Final":
      return "green";
    default:
      return "gray";
  }
}
