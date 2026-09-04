import { Trash2, LogOut, Users, Lock } from "lucide-react";
import type { Team } from "@/lib/data/team";
import RoleBadge from "./RoleBadge";
import InviteCodeButton from "./InviteCodeButton";

interface TeamListItemProps {
  team: Team;
  onAction: (team: Team) => void;   // open delete/leave modal
  onViewMembers: (team: Team) => void; // open members popup
}

export default function TeamListItem({
  team,
  onAction,
  onViewMembers,
}: TeamListItemProps) {
  const isLeader = team.role === "leader";
  const ActionIcon = isLeader ? Trash2 : LogOut;
  const actionLabel = isLeader ? `Bubarkan tim ${team.name}` : `Keluar dari tim ${team.name}`;
  const actionColor = isLeader
    ? "text-gray-700 hover:bg-primary-50 hover:text-primary-500 active:bg-primary-100"
    : "text-gray-700 hover:bg-amber-50 hover:text-amber-600 active:bg-amber-100";

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.035)] px-5 py-3.5">

      {/* ── Desktop layout ─────────────────────────── */}
      <div className="hidden md:flex md:items-center md:gap-4">
        {/* Avatar */}
        <div className="w-[50px] h-[50px] rounded-full bg-gray-900 flex items-center justify-center text-white text-[17px] font-semibold select-none flex-shrink-0">
          {team.initials}
        </div>

        {/* Name + locked badge */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <p className="text-[17px] font-semibold text-gray-900 truncate">{team.name}</p>
          {team.is_locked && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
              <Lock size={10} strokeWidth={2.2} />
              Terkunci
            </span>
          )}
        </div>

        {/* Role badge */}
        <div className="flex-shrink-0">
          <RoleBadge role={team.role} />
        </div>

        {/* Member count */}
        <div className="flex-shrink-0 w-[100px] text-[15px] text-gray-600 whitespace-nowrap">
          {team.member_count} Anggota
        </div>

        {/* Invite code */}
        <div className="flex-shrink-0">
          <InviteCodeButton code={team.join_code} />
        </div>

        {/* View members */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => onViewMembers(team)}
            aria-label={`Lihat anggota tim ${team.name}`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 transition-colors"
          >
            <Users size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Delete / Leave */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => onAction(team)}
            aria-label={actionLabel}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${actionColor}`}
          >
            <ActionIcon size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Mobile layout ──────────────────────────── */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Row 1: avatar + name + action buttons */}
        <div className="flex items-center gap-2">
          <div className="w-[44px] h-[44px] rounded-full bg-gray-900 flex items-center justify-center text-white text-[15px] font-semibold select-none flex-shrink-0">
            {team.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-semibold text-gray-900 truncate leading-tight">
              {team.name}
            </p>
            {team.is_locked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full mt-0.5">
                <Lock size={9} strokeWidth={2.2} />
                Terkunci
              </span>
            )}
          </div>

          {/* View members */}
          <button
            type="button"
            onClick={() => onViewMembers(team)}
            aria-label={`Lihat anggota tim ${team.name}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Users size={16} strokeWidth={1.8} />
          </button>

          {/* Delete / Leave */}
          <button
            type="button"
            onClick={() => onAction(team)}
            aria-label={actionLabel}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${actionColor}`}
          >
            <ActionIcon size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Row 2: metadata */}
        <div className="flex flex-wrap items-center gap-2 pl-[52px]">
          <RoleBadge role={team.role} />
          <span className="text-[13px] text-gray-600">{team.member_count} Anggota</span>
          <InviteCodeButton code={team.join_code} />
        </div>
      </div>
    </div>
  );
}

