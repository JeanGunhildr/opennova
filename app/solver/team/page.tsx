import { Users } from "lucide-react";
import { getMyTeamsAction } from "@/lib/actions/team";
import { getTeamInitials } from "@/lib/data/team";
import type { Team } from "@/lib/data/team";
import TeamPageClient from "@/component/dashboard/team/TeamPageClient";

export const dynamic = "force-dynamic";


// ── Server Component ───────────────────────────────────────
export default async function YourTeamPage() {
  const result = await getMyTeamsAction();

  // Transform MyTeam → Team shape for UI components
  const teams: Team[] = (result.teams ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    initials: getTeamInitials(t.name),
    role: t.role,
    member_count: t.member_count,
    join_code: t.join_code,
    is_locked: t.is_locked,
    captain_id: t.captain_id,
  }));

  const teamCount = teams.length;

  return (
    <TeamPageClient
      initialTeams={teams}
      teamCount={teamCount}
    />
  );
}

// ── Empty state (also used by client) ─────────────────────
export function TeamEmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] flex flex-col items-center justify-center py-14 px-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Users size={26} className="text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-gray-900 mb-1.5">Tidak ada tim di kategori ini</p>
      <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[320px]">
        Buat tim baru atau bergabung dengan kode undangan di atas.
      </p>
    </div>
  );
}