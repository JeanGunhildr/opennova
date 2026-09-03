"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function SeekerPageHeader({
  eyebrow = "Ringkasan Hari Ini",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
      <div className="flex-1 min-w-0">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ background: "#FFFFFF", border: "6px solid #373737" }}
          />
          <span className="text-[14px] font-semibold text-white">{eyebrow}</span>
        </div>

        {/* Title */}
        <h1
          className="text-white font-bold leading-[1.1]"
          style={{ fontSize: "40px", letterSpacing: "-0.025em" }}
        >
          {title}
        </h1>

        {/* Description */}
        <p className="mt-2 text-[16px] leading-[1.5] max-w-[760px]" style={{ color: "#A4A4A4" }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-start flex-shrink-0 pt-1">
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-white text-[15px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors"
        >
          <LayoutDashboard size={18} strokeWidth={1.8} />
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}