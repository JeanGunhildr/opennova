import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "brand";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: StatCardProps) {
  const isBrand = tone === "brand";

  return (
    <div
      className={[
        "relative min-w-0 rounded-[16px] p-5 min-h-[128px] flex flex-col justify-between overflow-hidden",
        isBrand
          ? "text-white"
          : "bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]",
      ].join(" ")}
      style={
        isBrand
          ? { background: "linear-gradient(115deg, #E30000 0%, #7F1717 100%)" }
          : undefined
      }
    >
      {isBrand && (
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent)" }}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={[
            "min-w-0 text-[13px] font-medium leading-snug",
            isBrand ? "text-white/85" : "text-gray-500",
          ].join(" ")}
        >
          {label}
        </p>
        <div
          className={[
            "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0",
            isBrand ? "bg-white/15" : "bg-primary-50",
          ].join(" ")}
        >
          <Icon
            size={18}
            strokeWidth={1.9}
            className={isBrand ? "text-white" : "text-primary-500"}
          />
        </div>
      </div>

      <div className="relative mt-3 min-w-0">
        <p
          className={[
            "font-bold tracking-tight leading-tight break-words [overflow-wrap:anywhere]",
            "text-[19px] sm:text-[21px] xl:text-[24px]",
            isBrand ? "text-white" : "text-gray-900",
          ].join(" ")}
        >
          {value}
        </p>
        {hint && (
          <p
            className={[
              "text-[12px] mt-1 break-words",
              isBrand ? "text-white/75" : "text-gray-400",
            ].join(" ")}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}