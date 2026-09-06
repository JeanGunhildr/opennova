import Image from "next/image";
import type { ComponentProps } from "react";

/**
 * OpenNova logo mark.
 * Uses the official brand mark asset at /icon.svg.
 */
export function OpenNovaLogoMark({
  width = 28,
  height = 28,
  className = "",
  ...props
}: Partial<ComponentProps<typeof Image>>) {
  return (
    <Image
      src="/icon.svg"
      alt="OpenNova"
      width={width}
      height={height}
      className={`object-contain shrink-0 ${className}`}
      priority
      {...props}
    />
  );
}

/** Full OpenNova brand lockup: mark + wordmark */
export function OpenNovaLogo({
  className,
  theme = "light",
}: {
  className?: string;
  theme?: "light" | "dark";
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <OpenNovaLogoMark width={28} height={28} />
      <span
        className={`font-semibold text-[16px] tracking-tight select-none leading-none ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        opennova
      </span>
    </span>
  );
}

