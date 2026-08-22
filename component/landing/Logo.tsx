import type { SVGProps } from "react";

/**
 * OpenNova logo mark.
 * A red rounded square containing an open-ring arc (the "Open" O)
 * and a filled dot at the gap (the "Nova" spark).
 */
export function OpenNovaLogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Red rounded square background */}
      <rect width="28" height="28" rx="7" fill="#E9201E" />
      {/* Open-ring arc — 270° counterclockwise, gap on the right side */}
      <path
        d="M14 7
           C10.13 7 7 10.13 7 14
           C7 17.87 10.13 21 14 21
           C16.63 21 18.94 19.67 20.24 17.66"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Nova spark dot — fills the gap at the right */}
      <circle cx="21.2" cy="10.5" r="2.1" fill="white" />
    </svg>
  );
}

/** Full OpenNova brand lockup: mark + wordmark */
export function OpenNovaLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <OpenNovaLogoMark />
      <span className="text-gray-900 font-semibold text-[15px] tracking-tight select-none">
        opennova
      </span>
    </span>
  );
}
