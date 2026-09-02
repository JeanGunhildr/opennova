"use client";

import { Camera, LogOut } from "lucide-react";

interface ProfileIdentityCardProps {
  name: string;
  email: string;
  initials: string;
  onLogout: () => void;
}

export default function ProfileIdentityCard({
  name,
  email,
  initials,
  onLogout,
}: ProfileIdentityCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative group w-24 h-24 mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-white text-[28px] font-bold select-none">
            {initials}
          </div>
          {/* Camera overlay */}
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera size={20} className="text-white" strokeWidth={1.8} />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-2">{name}</h2>

        {/* Role badge */}
        <span className="inline-flex items-center h-[26px] px-3 rounded-full bg-primary-50 text-primary-600 text-[12px] font-semibold mb-2">
          Solver
        </span>

        {/* Email */}
        <p className="text-[13px] text-gray-500">{email}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-5" />

      {/* Account meta */}
      <div className="flex flex-col gap-2.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-500">Bergabung sejak</span>
          <span className="text-[13px] font-medium text-gray-800">Jan 2025</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-500">Challenge diikuti</span>
          <span className="text-[13px] font-medium text-gray-800">8 challenge</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-500">Status akun</span>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#168A39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#168A39]" />
            Aktif
          </span>
        </div>
      </div>

      {/* Logout button */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-full flex items-center justify-center gap-2 text-[14px] transition-colors"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Keluar Akun
      </button>
    </div>
  );
}