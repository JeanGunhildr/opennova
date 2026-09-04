// ─────────────────────────────────────────────────────────
// OpenNova — Tim Anda (Your Team) types
// Re-exports from server action types for convenience in client components.
// ─────────────────────────────────────────────────────────

export type TeamRole = "leader" | "member";

/** Shape of a team as used in UI components. */
export interface Team {
  id: string;
  name: string;
  /** Two-letter initials derived from the team name. */
  initials: string;
  role: TeamRole;
  member_count: number;
  join_code: string;
  is_locked: boolean;
  captain_id: string;
}

/** Derive two-letter initials from a team name. */
export function getTeamInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}