import { Trash2 } from "lucide-react";
import type { Team } from "@/lib/data/team";
import RoleBadge from "./RoleBadge";
import InviteCodeButton from "./InviteCodeButton";

interface TeamListItemProps {
  team: Team;
  onDelete: (team: Team) => void;
}

export default function TeamListItem({ team, onDelete }: TeamListItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.035)] px-5 py-3.5">

      {/* ── Desktop layout ─────────────────────────── */}
      <div className="hidden md:flex md:items-center md:gap-4">
        {/* Avatar */}
        <div className="w-[50px] h-[50px] rounded-full bg-gray-900 flex items-center justify-center text-white text-[17px] font-semibold select-none flex-shrink-0">
          {team.initials}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-semibold text-gray-900 truncate">{team.name}</p>
        </div>

        {/* Role badge */}
        <div className="flex-shrink-0">
          <RoleBadge role={team.role} />
        </div>

        {/* Member count */}
        <div className="flex-shrink-0 w-[100px] text-[15px] text-gray-600 whitespace-nowrap">
          {team.memberCount} Anggota
        </div>

        {/* Last activity */}
        <div className="flex-shrink-0 w-[120px] text-[15px] text-gray-600 whitespace-nowrap">
          {team.lastActivity}
        </div>

        {/* Invite code */}
        <div className="flex-shrink-0">
          <InviteCodeButton code={team.inviteCode} />
        </div>

        {/* Delete */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => onDelete(team)}
            aria-label={`Hapus tim ${team.name}`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-primary-50 hover:text-primary-500 active:bg-primary-100 transition-colors"
          >
            <Trash2 size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Mobile layout ──────────────────────────── */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Row 1: avatar + name + delete */}
        <div className="flex items-center gap-3">
          <div className="w-[48px] h-[48px] rounded-full bg-gray-900 flex items-center justify-center text-white text-[15px] font-semibold select-none flex-shrink-0">
            {team.initials}
          </div>
          <p className="text-[16px] font-semibold text-gray-900 flex-1 truncate leading-tight">
            {team.name}
          </p>
          <button
            type="button"
            onClick={() => onDelete(team)}
            aria-label={`Hapus tim ${team.name}`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors flex-shrink-0"
          >
            <Trash2 size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* Row 2: metadata */}
        <div className="flex flex-wrap items-center gap-2 pl-[60px]">
          <RoleBadge role={team.role} />
          <span className="text-[13px] text-gray-600">{team.memberCount} Anggota</span>
          <span className="text-[13px] text-gray-400">{team.lastActivity}</span>
          <InviteCodeButton code={team.inviteCode} />
        </div>
      </div>
    </div>
  );
}