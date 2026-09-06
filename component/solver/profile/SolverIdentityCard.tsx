"use client";

import { User, CheckCircle2 } from "lucide-react";

interface SolverIdentityCardProps {
  fullName?: string;
  email?: string;
  institution?: string;
}

export default function SolverIdentityCard({
  fullName = "Solver OpenNova",
  email = "",
  institution = "Independen / Mahasiswa",
}: SolverIdentityCardProps) {
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "S";

  return (
    <div className="rounded-[18px] p-6 bg-white border border-[#E6E6E6] shadow-xs">
      <div className="flex items-start gap-4">
        {/* Avatar container */}
        <div className="relative shrink-0 w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold border-2 border-red-200 shadow-inner select-none">
          {initial}
        </div>

        {/* Identity text */}
        <div className="flex flex-col gap-1 min-w-0 pt-0.5">
          <p className="font-bold text-gray-900 text-lg leading-tight truncate">
            {fullName}
          </p>
          <p className="text-[13px] text-gray-600 truncate">
            {institution || "Solver OpenNova"}
          </p>
          {email && (
            <p className="text-[12px] text-gray-500 truncate">
              {email}
            </p>
          )}
          <div className="inline-flex items-center gap-1.5 mt-1 text-[12px] font-semibold text-emerald-600">
            <CheckCircle2 size={14} strokeWidth={2.2} />
            Akun Solver Aktif
          </div>
        </div>
      </div>
    </div>
  );
}
