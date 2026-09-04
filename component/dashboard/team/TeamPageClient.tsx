"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import type { Team, TeamRole } from "@/lib/data/team";
import CreateTeamCard from "./CreateTeamCard";
import JoinTeamCard from "./JoinTeamCard";
import TeamListItem from "./TeamListItem";
import DeleteTeamModal from "./DeleteTeamModal";
import TeamMembersPopup from "./TeamMembersPopup";
import TeamAlertModal from "./TeamAlertModal";
import { deactivateTeamAction, leaveTeamAction } from "@/lib/actions/team";

type FilterId = "all" | "leader" | "member";

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "leader", label: "Sebagai Ketua" },
  { id: "member", label: "Sebagai Anggota" },
];

function TeamEmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] flex flex-col items-center justify-center py-14 px-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Users size={26} className="text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-gray-900 mb-1.5">
        Tidak ada tim di kategori ini
      </p>
      <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[320px]">
        Buat tim baru atau bergabung dengan kode undangan di atas.
      </p>
    </div>
  );
}

interface TeamPageClientProps {
  initialTeams: Team[];
  teamCount: number;
}

export default function TeamPageClient({
  initialTeams,
  teamCount,
}: TeamPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    team: Team | null;
    mode: "delete" | "leave";
  }>({
    open: false,
    team: null,
    mode: "delete",
  });

  const [membersModal, setMembersModal] = useState<{
    open: boolean;
    team: Team | null;
  }>({
    open: false,
    team: null,
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Derived filtered list
  const filtered =
    activeFilter === "all"
      ? initialTeams
      : initialTeams.filter((t) =>
          activeFilter === "leader" ? t.role === "leader" : t.role === "member"
        );

  function countFor(filter: FilterId) {
    if (filter === "all") return initialTeams.length;
    const role: TeamRole = filter === "leader" ? "leader" : "member";
    return initialTeams.filter((t) => t.role === role).length;
  }

  function handleActionClick(team: Team) {
    setActionModal({
      open: true,
      team,
      mode: team.role === "leader" ? "delete" : "leave",
    });
  }

  function handleViewMembers(team: Team) {
    setMembersModal({
      open: true,
      team,
    });
  }

  function confirmAction() {
    const { team, mode } = actionModal;
    if (!team) return;

    const formData = new FormData();
    formData.set("team_id", team.id);

    startTransition(async () => {
      let result;
      if (mode === "delete") {
        result = await deactivateTeamAction(formData);
      } else {
        result = await leaveTeamAction(formData);
      }

      setActionModal({ open: false, team: null, mode: "delete" });

      if (result.success && result.data) {
        setAlert({
          type: "success",
          title: mode === "delete" ? "Tim Dibubarkan" : "Berhasil Keluar",
          message:
            mode === "delete"
              ? `Tim "${result.data.teamName as string}" telah dinonaktifkan.`
              : `Anda telah keluar dari tim "${result.data.teamName as string}".`,
        });
      } else {
        setAlert({
          type: "error",
          title: "Gagal Memproses Aksi",
          message: result.error ?? "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    });
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-9 max-w-[1160px]">
        {/* ── Page header ─────────────────────────── */}
        <div className="flex flex-col gap-1 mb-7">
          <h1 className="text-[36px] lg:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
            Ikuti Challenge Bersama Tim
          </h1>
          <p className="text-[17px] lg:text-[18px] text-gray-600 leading-[1.45]">
            Bentuk tim atau bergabung dengan tim anda sendiri untuk memberikan
            solusi bersama.
          </p>
        </div>

        {/* ── Action cards grid ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <CreateTeamCard teamCount={teamCount} />
          <JoinTeamCard teamCount={teamCount} />
        </div>

        {/* ── Team list section ────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-[24px] font-bold text-gray-900 leading-tight">
              Daftar Tim Anda
            </h2>

            {/* Filter tabs — segmented pill control */}
            <div className="flex items-center gap-0.5 p-1 bg-[#E9EAEC] rounded-full self-start md:self-auto flex-shrink-0">
              {FILTER_TABS.map(({ id, label }) => {
                const isActive = activeFilter === id;
                const count = countFor(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveFilter(id)}
                    className={[
                      "h-9 px-4 rounded-full text-[13px] transition-all whitespace-nowrap",
                      isActive
                        ? "bg-white text-gray-900 font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                        : "text-gray-600 font-medium hover:text-gray-800 hover:bg-white/45",
                    ].join(" ")}
                  >
                    {label}
                    {count > 0 && (
                      <span
                        className={[
                          "ml-1.5 text-[11px] font-semibold",
                          isActive ? "text-gray-500" : "text-gray-400",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <TeamEmptyState />
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((team) => (
                <TeamListItem
                  key={team.id}
                  team={team}
                  onAction={handleActionClick}
                  onViewMembers={handleViewMembers}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete / Leave confirmation modal ────────────── */}
      <DeleteTeamModal
        isOpen={actionModal.open}
        mode={actionModal.mode}
        teamName={actionModal.team?.name ?? ""}
        isLocked={actionModal.team?.is_locked ?? false}
        onClose={() => setActionModal({ open: false, team: null, mode: "delete" })}
        onConfirm={confirmAction}
      />

      {/* ── Members popup modal ────────────── */}
      {membersModal.team && (
        <TeamMembersPopup
          isOpen={membersModal.open}
          teamId={membersModal.team.id}
          teamName={membersModal.team.name}
          onClose={() => setMembersModal({ open: false, team: null })}
        />
      )}

      {/* ── Alert modal ────────────── */}
      {alert && (
        <TeamAlertModal
          isOpen={true}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}


