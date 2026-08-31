// ─────────────────────────────────────────────────────────
// OpenNova — Tim Anda (Your Team) mock data
// ─────────────────────────────────────────────────────────

export type TeamRole = "leader" | "member";

export interface Team {
  id: string;
  name: string;
  initials: string;
  role: TeamRole;
  memberCount: number;
  lastActivity: string;
  inviteCode: string;
}

export const mockTeams: Team[] = [
  {
    id: "t-1",
    name: "Inovasi Nusantara",
    initials: "IN",
    role: "leader",
    memberCount: 4,
    lastActivity: "2 jam lalu",
    inviteCode: "INN247",
  },
  {
    id: "t-2",
    name: "Tim Solusi Energi",
    initials: "SE",
    role: "leader",
    memberCount: 3,
    lastActivity: "1 hari lalu",
    inviteCode: "TSE891",
  },
  {
    id: "t-3",
    name: "Akselerasi Digital",
    initials: "AD",
    role: "member",
    memberCount: 5,
    lastActivity: "3 hari lalu",
    inviteCode: "AKD553",
  },
  {
    id: "t-4",
    name: "Green Future Lab",
    initials: "GF",
    role: "member",
    memberCount: 6,
    lastActivity: "1 minggu lalu",
    inviteCode: "GFL774",
  },
];