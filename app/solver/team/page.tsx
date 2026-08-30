"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { mockTeams } from "@/lib/data/team";
import type { Team, TeamRole } from "@/lib/data/team";
import CreateTeamCard from "@/component/dashboard/team/CreateTeamCard";
import JoinTeamCard from "@/component/dashboard/team/JoinTeamCard";
import TeamListItem from "@/component/dashboard/team/TeamListItem";
import DeleteTeamModal from "@/component/dashboard/team/DeleteTeamModal";

// ── Filter types ───────────────────────────────────────────
type FilterId = "all" | "leader" | "member";

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: "all",    label: "Semua"           },
  { id: "leader", label: "Sebagai Ketua"   },
  { id: "member", label: "Sebagai Anggota" },
];

// ── Empty state ────────────────────────────────────────────
function TeamEmptyState() {
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

// ── Page ───────────────────────────────────────────────────
export default function YourTeamPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; team: Team | null }>({
    open: false,
    team: null,
  });

  // Derived: filtered list
  const filtered =
    activeFilter === "all"
      ? teams
      : teams.filter((t) =>
          activeFilter === "leader" ? t.role === "leader" : t.role === "member"
        );

  // Derived: per-filter counts
  function countFor(filter: FilterId) {
    if (filter === "all") return teams.length;
    const role: TeamRole = filter === "leader" ? "leader" : "member";
    return teams.filter((t) => t.role === role).length;
  }

  // Handlers
  function openDelete(team: Team) {
    setDeleteModal({ open: true, team });
  }
  function closeDelete() {
    setDeleteModal({ open: false, team: null });
  }
  function confirmDelete() {
    if (!deleteModal.team) return;
    setTeams((prev) => prev.filter((t) => t.id !== deleteModal.team!.id));
    closeDelete();
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
            Bentuk tim atau bergabung dengan tim anda sendiri untuk memberikan solusi bersama.
          </p>
        </div>

        {/* ── Action cards grid ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <CreateTeamCard />
          <JoinTeamCard />
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
                <TeamListItem key={team.id} team={team} onDelete={openDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirmation modal ────────────── */}
      <DeleteTeamModal
        isOpen={deleteModal.open}
        teamName={deleteModal.team?.name ?? ""}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}