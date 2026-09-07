// lib/services/challenge-phase.ts
// Automated competition phase processor (idempotent, cron-driven).
// Checks timeline dates and advances challenge phases automatically:
//   1. ongoing -> judging (when expert_judging start date has arrived)
//   2. judging -> final_pitch (when final_pitch start date has arrived; calculates expert scores & picks Top 3)
//   3. final_pitch -> completed (when announcement date has arrived; calculates final scores & awards winners)

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  selectTopFinalists,
  enrichEntriesWithScores,
  rankFinalists,
  type CriterionRow,
} from "./scoring";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHED_KEY ||
    "";
  return createSupabaseClient(url, key);
}

export interface PhaseProcessingSummary {
  processedChallenges: number;
  transitions: Array<{
    challengeId: string;
    challengeName: string;
    fromStatus: string;
    toStatus: string;
    detail: string;
  }>;
  errors: Array<{
    challengeId: string;
    error: string;
  }>;
}

export async function processChallengePhases(): Promise<PhaseProcessingSummary> {
  const supabase = getAdminClient();
  const summary: PhaseProcessingSummary = {
    processedChallenges: 0,
    transitions: [],
    errors: [],
  };

  const now = new Date();

  // Fetch all active challenges that can transition automatically
  const { data: challenges, error: chErr } = await supabase
    .from("challenges")
    .select(
      `
      id,
      name,
      status,
      prize_pool,
      expert_weight,
      pitch_weight,
      challenge_timelines (
        id,
        title,
        start_date,
        end_date,
        sort_order
      )
    `,
    )
    .in("status", ["ongoing", "judging", "final_pitch"]);

  if (chErr) {
    console.error("processChallengePhases error fetching challenges:", chErr);
    summary.errors.push({ challengeId: "all", error: chErr.message });
    return summary;
  }

  if (!challenges || challenges.length === 0) {
    return summary;
  }

  summary.processedChallenges = challenges.length;

  for (const ch of challenges) {
    try {
      const timelines: any[] = Array.isArray(ch.challenge_timelines)
        ? ch.challenge_timelines
        : [];

      const expertTimeline = timelines.find(
        (t) => t.title === "Penjurian Ahli" || t.title?.toLowerCase().includes("penjurian"),
      );

      const pitchTimeline = timelines.find(
        (t) => t.title === "Pitching Final" || t.title?.toLowerCase().includes("pitch"),
      );

      const announceTimeline = timelines.find(
        (t) => t.title === "Pengumuman Pemenang" || t.title?.toLowerCase().includes("pengumuman"),
      );

      // ── Transition 1: ongoing -> judging ─────────────────────────────
      if (ch.status === "ongoing" && expertTimeline?.start_date) {
        const expertStart = new Date(expertTimeline.start_date);
        if (now >= expertStart) {
          // Move status to judging
          await supabase
            .from("challenges")
            .update({ status: "judging" })
            .eq("id", ch.id);

          // Auto-eliminate entries without submission
          const { data: entries } = await supabase
            .from("challenge_entries")
            .select("id, solver_id, submissions(id)")
            .eq("challenge_id", ch.id);

          const noSubIds: string[] = [];
          const notifyUsers: string[] = [];

          for (const e of entries ?? []) {
            const subs = Array.isArray(e.submissions) ? e.submissions : [];
            if (subs.length === 0) noSubIds.push(e.id);
            if (e.solver_id) notifyUsers.push(e.solver_id);
          }

          if (noSubIds.length > 0) {
            await supabase
              .from("challenge_entries")
              .update({ status: "eliminated" })
              .in("id", noSubIds);
          }

          // Send notifications
          if (notifyUsers.length > 0) {
            const notifRows = notifyUsers.map((uid) => ({
              user_id: uid,
              type: "challenge",
              title: "Penjurian Ahli Dimulai",
              body: `Challenge "${ch.name}" kini memasuki tahap Penjurian Ahli. Dewan juri sedang menilai submission yang masuk.`,
              action_url: `/solver/challenge/${ch.id}`,
              challenge_id: ch.id,
              is_read: false,
            }));
            await supabase.from("notifications").insert(notifRows);
          }

          summary.transitions.push({
            challengeId: ch.id,
            challengeName: ch.name,
            fromStatus: "ongoing",
            toStatus: "judging",
            detail: `Automated transition to Penjurian Ahli. ${noSubIds.length} entries without submission eliminated.`,
          });
        }
      }

      // ── Transition 2: judging -> final_pitch ────────────────────────
      if (ch.status === "judging" && pitchTimeline?.start_date) {
        const pitchStart = new Date(pitchTimeline.start_date);
        if (now >= pitchStart) {
          // Fetch criteria for stage expert_judging
          const { data: criteriaRows } = await supabase
            .from("judging_criteria")
            .select("id, stage")
            .eq("challenge_id", ch.id);

          const criteria: CriterionRow[] = (criteriaRows ?? []).map((c: any) => ({
            id: c.id,
            stage: c.stage,
          }));

          const { data: entries } = await supabase
            .from("challenge_entries")
            .select("id, solver_id, team_id, status, submissions(drive_url, submitted_at)")
            .eq("challenge_id", ch.id)
            .neq("status", "eliminated");

          if (entries && entries.length > 0) {
            const entryIds = entries.map((e: any) => e.id);
            const { data: scoreRows } = await supabase
              .from("criterion_scores")
              .select("entry_id, criterion_id, score")
              .in("entry_id", entryIds);

            const scoresMap = new Map<string, Array<{ criterion_id: string; score: number }>>();
            for (const r of scoreRows ?? []) {
              const entryId = (r as any).entry_id;
              if (!scoresMap.has(entryId)) scoresMap.set(entryId, []);
              scoresMap.get(entryId)!.push({
                criterion_id: (r as any).criterion_id,
                score: Number((r as any).score),
              });
            }

            // All non-eliminated entries are finalist candidates in auto-phase.
            // (If a seeker moves to final_pitch manually, everyone non-eliminated is considered.)
            const rawEntries = entries.map((e: any) => {
                const subs = Array.isArray(e.submissions) ? e.submissions : [];
                const latestSub = subs[0];
                return {
                  entryId: e.id,
                  solverUserId: e.solver_id ?? null,
                  teamId: e.team_id ?? null,
                  submittedAt: latestSub?.submitted_at ?? null,
                  scores: scoresMap.get(e.id) ?? [],
                };
              });

            const enriched = enrichEntriesWithScores(
              rawEntries,
              criteria,
              Number(ch.expert_weight) || 50,
              Number(ch.pitch_weight) || 50,
            );

            const topFinalists = selectTopFinalists(enriched, 3);
            const finalistEntryIds = new Set(topFinalists.map((f) => f.entryId));

            const isoNow = now.toISOString();
            for (const f of topFinalists) {
              await supabase
                .from("challenge_entries")
                .update({
                  is_finalist: true,
                  finalist_selected_at: isoNow,
                  status: "finalist",
                })
                .eq("id", f.entryId);
            }

            const nonFinalistIds = entryIds.filter((id) => !finalistEntryIds.has(id));
            if (nonFinalistIds.length > 0) {
              await supabase
                .from("challenge_entries")
                .update({ status: "eliminated" })
                .in("id", nonFinalistIds);
            }

            await supabase
              .from("challenges")
              .update({ status: "final_pitch" })
              .eq("id", ch.id);

            // Send notifications
            const notifRows: any[] = [];
            for (const e of entries) {
              const isFinalist = finalistEntryIds.has(e.id);
              let recipientUserIds: string[] = [];

              if (e.team_id) {
                const { data: members } = await supabase
                  .from("team_members")
                  .select("user_id")
                  .eq("team_id", e.team_id)
                  .eq("status", "active");
                recipientUserIds = (members ?? []).map((m: any) => m.user_id);
              } else if (e.solver_id) {
                recipientUserIds = [e.solver_id];
              }

              for (const userId of recipientUserIds) {
                if (isFinalist) {
                  notifRows.push({
                    user_id: userId,
                    type: "challenge",
                    title: "🎉 Selamat! Kamu Masuk Top 3 Finalist!",
                    message: e.team_id
                      ? `Tim Anda pada challenge "${ch.name}" terpilih sebagai Top 3 Finalist. Bersiaplah untuk Pitching Final!`
                      : `Solusimu pada challenge "${ch.name}" terpilih sebagai Top 3 Finalist. Bersiaplah untuk Pitching Final!`,
                    challenge_id: ch.id,
                    is_read: false,
                  });
                } else {
                  notifRows.push({
                    user_id: userId,
                    type: "challenge",
                    title: "Hasil Seleksi Penjurian Ahli",
                    message: e.team_id
                      ? `Terima kasih atas partisipasi tim Anda pada challenge "${ch.name}". Tim Anda belum lolos ke tahap Final Pitch kali ini.`
                      : `Terima kasih atas partisipasimu pada challenge "${ch.name}". Kamu belum lolos ke tahap Final Pitch kali ini.`,
                    challenge_id: ch.id,
                    is_read: false,
                  });
                }
              }
            }
            if (notifRows.length > 0) {
              await supabase.from("notifications").insert(notifRows);
            }

            summary.transitions.push({
              challengeId: ch.id,
              challengeName: ch.name,
              fromStatus: "judging",
              toStatus: "final_pitch",
              detail: `Selected ${topFinalists.length} finalists.`,
            });
          }
        }
      }

      // ── Transition 3: final_pitch -> completed ──────────────────────
      if (ch.status === "final_pitch" && announceTimeline?.start_date) {
        const announceStart = new Date(announceTimeline.start_date);
        if (now >= announceStart) {
          const { data: criteriaRows } = await supabase
            .from("judging_criteria")
            .select("id, stage")
            .eq("challenge_id", ch.id);

          const criteria: CriterionRow[] = (criteriaRows ?? []).map((c: any) => ({
            id: c.id,
            stage: c.stage,
          }));

          const { data: entries } = await supabase
            .from("challenge_entries")
            .select("id, solver_id, team_id, is_finalist, status, submissions(drive_url, submitted_at)")
            .eq("challenge_id", ch.id)
            .or("is_finalist.eq.true,status.eq.finalist");

          if (entries && entries.length > 0) {
            const entryIds = entries.map((e: any) => e.id);
            const { data: scoreRows } = await supabase
              .from("criterion_scores")
              .select("entry_id, criterion_id, score")
              .in("entry_id", entryIds);

            const scoresMap = new Map<string, Array<{ criterion_id: string; score: number }>>();
            for (const r of scoreRows ?? []) {
              const entryId = (r as any).entry_id;
              if (!scoresMap.has(entryId)) scoresMap.set(entryId, []);
              scoresMap.get(entryId)!.push({
                criterion_id: (r as any).criterion_id,
                score: Number((r as any).score),
              });
            }

            const rawEntries = entries.map((e: any) => {
              const subs = Array.isArray(e.submissions) ? e.submissions : [];
              const latestSub = subs[0];
              return {
                entryId: e.id,
                solverUserId: e.solver_id ?? null,
                teamId: e.team_id ?? null,
                submittedAt: latestSub?.submitted_at ?? null,
                scores: scoresMap.get(e.id) ?? [],
              };
            });

            const enriched = enrichEntriesWithScores(
              rawEntries,
              criteria,
              Number(ch.expert_weight) || 50,
              Number(ch.pitch_weight) || 50,
            );

            const ranked = rankFinalists(enriched);
            const prizePool = Number(ch.prize_pool) || 0;
            let prizeDistribution: Record<number, number> = {};
            if (ranked.length === 1) {
              prizeDistribution = { 1: prizePool };
            } else if (ranked.length === 2) {
              prizeDistribution = {
                1: Math.round(prizePool * 0.7),
                2: Math.round(prizePool * 0.3),
              };
            } else {
              prizeDistribution = {
                1: Math.round(prizePool * 0.6),
                2: Math.round(prizePool * 0.25),
                3: Math.round(prizePool * 0.15),
              };
            }

            for (const r of ranked) {
              const isRank1 = r.rank === 1;
              await supabase
                .from("challenge_entries")
                .update({
                  is_winner: isRank1,
                  winner_rank: r.rank,
                  status: isRank1 ? "winner" : "finalist",
                })
                .eq("id", r.entryId);

              let recipientUserId: string | null = r.solverUserId;
              if (!recipientUserId && r.teamId) {
                const { data: team } = await supabase
                  .from("teams")
                  .select("captain_id")
                  .eq("id", r.teamId)
                  .maybeSingle();
                recipientUserId = team?.captain_id ?? null;
              }

              const prizeAmount = prizeDistribution[r.rank] ?? 0;

              // Insert prize award (actual columns: entry_id, recipient_user_id, amount, note)
              await supabase.from("prize_awards").upsert(
                {
                  entry_id: r.entryId,
                  recipient_user_id: recipientUserId,
                  amount: prizeAmount,
                  note: `Juara ${r.rank}`,
                },
                { onConflict: "entry_id" },
              );

              // Insert certificate (actual columns: entry_id, user_id, certificate_number)
              if (recipientUserId) {
                await supabase.from("certificates").upsert(
                  {
                    entry_id: r.entryId,
                    user_id: recipientUserId,
                    certificate_number: `CERT-${ch.id.slice(0, 8).toUpperCase()}-${r.rank}`,
                  },
                  { onConflict: "entry_id" },
                );
              }

              // Credit prize balance for winners (Top 3)
              // Individual: credited to solverUserId
              // Team: credited to team's captain_id ONLY
              if (recipientUserId && prizeAmount > 0) {
                const { data: sp } = await supabase
                  .from("solver_profiles")
                  .select("balance")
                  .eq("user_id", recipientUserId)
                  .maybeSingle();

                const currentBalance = Number(sp?.balance ?? 0);
                const newBalance = currentBalance + prizeAmount;

                await supabase
                  .from("solver_profiles")
                  .update({ balance: newBalance })
                  .eq("user_id", recipientUserId);

                await supabase
                  .from("balance_transactions")
                  .insert({
                    user_id: recipientUserId,
                    amount: prizeAmount,
                    type: "prize",
                    description: `Hadiah Juara ${r.rank} - ${ch.name}`,
                    reference_id: ch.id,
                  });
              }
            }

            await supabase
              .from("challenges")
              .update({ status: "completed" })
              .eq("id", ch.id);

            // Send notifications to all participants
            const { data: allEntries } = await supabase
              .from("challenge_entries")
              .select("id, solver_id, team_id, team_name_snapshot, winner_rank, is_winner, status")
              .eq("challenge_id", ch.id);

            const notifRows: any[] = [];
            for (const e of allEntries ?? []) {
              const rankObj = ranked.find((r) => r.entryId === e.id);
              const isWinner = Boolean(rankObj && rankObj.rank <= 3);
              const prizeAmount = rankObj ? (prizeDistribution[rankObj.rank] ?? 0) : 0;
              const rankLabel = rankObj?.rank === 1 ? "Juara 1 🏆" : rankObj?.rank === 2 ? "Juara 2 🥈" : "Juara 3 🥉";

              if (e.team_id) {
                const { data: team } = await supabase
                  .from("teams")
                  .select("captain_id")
                  .eq("id", e.team_id)
                  .maybeSingle();
                const captainId = team?.captain_id;

                const { data: members } = await supabase
                  .from("team_members")
                  .select("user_id")
                  .eq("team_id", e.team_id)
                  .eq("status", "active");

                const teamName = e.team_name_snapshot || "Tim";

                for (const member of members ?? []) {
                  const isCaptain = member.user_id === captainId;
                  if (isWinner && rankObj) {
                    if (isCaptain) {
                      notifRows.push({
                        user_id: member.user_id,
                        type: "earnings",
                        title: `🏆 ${rankLabel} Challenge — Tim ${teamName}!`,
                        message: `Selamat! Tim "${teamName}" berhasil meraih ${rankLabel} pada challenge "${ch.name}". Hadiah senilai Rp ${prizeAmount.toLocaleString("id-ID")} telah ditambahkan ke saldo Anda sebagai perwakilan ketua tim!`,
                        challenge_id: ch.id,
                        is_read: false,
                      });
                    } else {
                      notifRows.push({
                        user_id: member.user_id,
                        type: "earnings",
                        title: `🏆 ${rankLabel} Challenge — Tim ${teamName}!`,
                        message: `Selamat! Tim "${teamName}" berhasil meraih ${rankLabel} pada challenge "${ch.name}". Uang pembinaan sebesar Rp ${prizeAmount.toLocaleString("id-ID")} diserahkan melalui perwakilan ketua tim.`,
                        challenge_id: ch.id,
                        is_read: false,
                      });
                    }
                  } else {
                    notifRows.push({
                      user_id: member.user_id,
                      type: "challenge",
                      title: "Pengumuman Pemenang Challenge",
                      message: `Pemenang resmi challenge "${ch.name}" telah diumumkan. Terima kasih atas partisipasi tim "${teamName}"!`,
                      challenge_id: ch.id,
                      is_read: false,
                    });
                  }
                }
              } else if (e.solver_id) {
                if (isWinner && rankObj) {
                  notifRows.push({
                    user_id: e.solver_id,
                    type: "earnings",
                    title: `🏆 ${rankLabel} Challenge!`,
                    message: `Selamat! Solusi Anda meraih ${rankLabel} pada challenge "${ch.name}". Hadiah senilai Rp ${prizeAmount.toLocaleString("id-ID")} telah ditambahkan ke saldo akun Anda!`,
                    challenge_id: ch.id,
                    is_read: false,
                  });
                } else {
                  notifRows.push({
                    user_id: e.solver_id,
                    type: "challenge",
                    title: "Pengumuman Pemenang Challenge",
                    message: `Pemenang resmi challenge "${ch.name}" telah diumumkan. Terima kasih atas partisipasimu!`,
                    challenge_id: ch.id,
                    is_read: false,
                  });
                }
              }
            }
            if (notifRows.length > 0) {
              await supabase.from("notifications").insert(notifRows);
            }

            summary.transitions.push({
              challengeId: ch.id,
              challengeName: ch.name,
              fromStatus: "final_pitch",
              toStatus: "completed",
              detail: `Announced winner and distributed prize/certificates to ${ranked.length} finalists.`,
            });
          }
        }
      }
    } catch (err: any) {
      console.error(`Error processing challenge ${ch.id}:`, err);
      summary.errors.push({ challengeId: ch.id, error: err?.message || "Unknown error" });
    }
  }

  return summary;
}
