import { base44 } from "@/api/base44Client";

export const RANK_TIERS = [
  { name: "Bronze", min: 0, color: "#c08050" },
  { name: "Silver", min: 800, color: "#c8c8c8" },
  { name: "Gold", min: 1000, color: "#f0c060" },
  { name: "Platinum", min: 1200, color: "#5ad8c0" },
  { name: "Diamond", min: 1400, color: "#5a9af8" },
  { name: "Master", min: 1600, color: "#c860f0" }
];

export function rankForElo(elo) { let r = RANK_TIERS[0]; for (const t of RANK_TIERS) if (elo >= t.min) r = t; return r; }
export function nextTier(elo) { for (const t of RANK_TIERS) if (elo < t.min) return t; return null; }
export function progressToNext(elo) { const cur = rankForElo(elo); const nxt = nextTier(elo); if (!nxt) return 1; return Math.max(0, Math.min(1, (elo - cur.min) / (nxt.min - cur.min))); }

const K = 32;
export function expectedScore(my, opp) { return 1 / (1 + Math.pow(10, (opp - my) / 400)); }
export function computeElo(myElo, oppElo, won) { const exp = expectedScore(myElo, oppElo); return Math.round(myElo + K * ((won ? 1 : 0) - exp)); }

export const BOT_RATING = { easy: 800, normal: 1000, hard: 1200, extreme: 1400 };
export function eloScaleForElo(elo) { return Math.max(0, Math.min(1, (elo - 800) / 800)); }
export function botRatingForElo(elo) { const s = eloScaleForElo(elo); return Math.round(elo + 40 + s * 160); }

export async function getMyProfile() {
  const me = await base44.auth.me();
  const list = await base44.entities.PlayerProfile.filter({ user_id: me.id });
  if (list.length) return { ...list[0], user: me };
  const created = await base44.entities.PlayerProfile.create({ user_id: me.id, name: me.full_name || (me.email ? me.email.split("@")[0] : "Fighter"), elo: 1000, wins: 0, losses: 0, streak: 0, best_streak: 0 });
  return { ...created, user: me };
}

export async function getProfileByUser(userId) { const list = await base44.entities.PlayerProfile.filter({ user_id: userId }); return list.length ? list[0] : null; }
export async function getLeaderboard(limit = 5) { return base44.entities.PlayerProfile.list("-elo", limit); }

export async function recordMatchResult(won, opponentElo) {
  const p = await getMyProfile();
  const newElo = computeElo(p.elo, opponentElo, won);
  const wins = (p.wins || 0) + (won ? 1 : 0);
  const losses = (p.losses || 0) + (won ? 0 : 1);
  const streak = won ? ((p.streak || 0) > 0 ? p.streak + 1 : 1) : 0;
  const best_streak = Math.max(p.best_streak || 0, streak);
  const updated = await base44.entities.PlayerProfile.update(p.id, { elo: newElo, wins, losses, streak, best_streak });
  return { ...updated, user: p.user, delta: newElo - p.elo };
}
