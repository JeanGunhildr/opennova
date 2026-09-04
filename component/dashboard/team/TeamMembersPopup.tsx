"use client";

import { useEffect, useState } from "react";
import { X, Crown, User } from "lucide-react";
import { getTeamMembersAction } from "@/lib/actions/team";
import type { TeamMember } from "@/lib/actions/team";

interface TeamMembersPopupProps {
  isOpen: boolean;
  teamId: string;
  teamName: string;
  onClose: () => void;
}

export default function TeamMembersPopup({
  isOpen,
  teamId,
  teamName,
  onClose,
}: TeamMembersPopupProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getTeamMembersAction(teamId).then((res) => {
      if (res.success && res.members) {
        setMembers(res.members);
      } else {
        setError(res.error ?? "Gagal memuat anggota.");
      }
      setLoading(false);
    });
  }, [isOpen, teamId]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function getInitials(name: string) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(4px)" }}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[400px] bg-white border border-gray-200 rounded-[20px] shadow-[0_24px_70px_rgba(0,0,0,0.20)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="members-popup-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2
              id="members-popup-title"
              className="text-[17px] font-bold text-gray-900 leading-tight"
            >
              Anggota Tim
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5 truncate max-w-[260px]">
              {teamName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 min-h-[100px]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-[14px] text-red-500 text-center py-6">{error}</p>
          )}

          {!loading && !error && members.length === 0 && (
            <p className="text-[14px] text-gray-500 text-center py-6">
              Belum ada anggota.
            </p>
          )}

          {!loading && !error && members.length > 0 && (
            <ul className="space-y-2.5">
              {members.map((member) => (
                <li
                  key={member.user_id}
                  className="flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div
                    className={[
                      "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold select-none flex-shrink-0",
                      member.is_captain
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700",
                    ].join(" ")}
                  >
                    {getInitials(member.full_name)}
                  </div>

                  {/* Name */}
                  <span className="flex-1 text-[15px] font-medium text-gray-900 truncate">
                    {member.full_name}
                  </span>

                  {/* Badge */}
                  {member.is_captain ? (
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Crown size={11} strokeWidth={2} />
                      Ketua
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      <User size={11} strokeWidth={2} />
                      Anggota
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-1">
          <p className="text-[12px] text-gray-400 text-center">
            {!loading && members.length > 0
              ? `${members.length} dari 4 slot anggota terisi`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
