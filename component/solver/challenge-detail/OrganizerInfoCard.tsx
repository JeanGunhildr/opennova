"use client";

import { BadgeCheck, ShieldAlert } from "lucide-react";

interface OrganizerInfoCardProps {
  companyName: string;
  companyInitials: string;
  industry: string;
  about: string;
  onOpenCopyrightModal: () => void;
}

export default function OrganizerInfoCard({
  companyName,
  companyInitials,
  industry,
  about,
  onOpenCopyrightModal,
}: OrganizerInfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04)]">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center gap-2.5">
        <div className="w-[38px] h-[38px] rounded-full bg-gray-100 text-[13px] font-bold text-gray-800 flex items-center justify-center flex-shrink-0 select-none">
          {companyInitials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[13px] font-bold text-gray-800 truncate">
              {companyName}
            </h4>
            <BadgeCheck size={14} className="text-[#E30000] flex-shrink-0" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] text-gray-500 block truncate">
            {industry}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <span className="text-[12px] font-bold text-gray-800 block">
          Tentang Penyelenggara
        </span>
        <p className="text-[11px] leading-[1.55] text-gray-600 mt-1">
          {about}
        </p>

        <button
          type="button"
          onClick={onOpenCopyrightModal}
          className="w-full h-[38px] rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-[12px] font-semibold mt-4 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ShieldAlert size={14} className="text-gray-500" strokeWidth={1.8} />
          Lihat Kesepakatan Hak Cipta
        </button>
      </div>
    </div>
  );
}
