// Online multiplayer over the MatchRoom entity + realtime subscriptions.
import { base44 } from "@/api/base44Client";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function genCode(len = 4) {
  let s = "";
  for (let i = 0; i < len; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

export async function getUser() {
  try { return await base44.auth.me(); } catch { return null; }
}

export async function createRoom({ mode, stageId, hostChar, difficulty, hostElo }) {
  const me = await getUser();
  if (!me) throw new Error("Not signed in");
  const code = genCode();
  return await base44.entities.MatchRoom.create({
    code, mode, host_id: me.id, status: "waiting",
    stage_id: stageId, host_char: hostChar, difficulty: difficulty || "normal",
    host_elo: hostElo ?? 1000,
    guest_id: "", guest_char: ""
  });
}

export async function findPublicRoom(targetElo) {
  const list = await base44.entities.MatchRoom.filter({ status: "waiting", mode: "public" }, "-created_date", 20);
  const open = (list || []).filter((r) => !r.guest_id);
  if (!open.length) return null;
  if (targetElo == null) return open[0];
  const scored = open.map((r) => ({ r, d: Math.abs((r.host_elo || 1000) - targetElo) }));
  scored.sort((a, b) => a.d - b.d);
  return scored[0].r;
}

export async function findRoomByCode(code) {
  const list = await base44.entities.MatchRoom.filter({ status: "waiting", code }, "-created_date", 5);
  return (list || []).find((r) => !r.guest_id) || null;
}

export async function joinRoom(roomId, guestChar) {
  const me = await getUser();
  if (!me) throw new Error("Not signed in");
  await base44.entities.MatchRoom.update(roomId, { guest_id: me.id, guest_char: guestChar, status: "playing" });
}

export function subscribeRoom(roomId, cb) {
  return base44.entities.MatchRoom.subscribe((ev) => {
    if (ev.id !== roomId) return;
    if (ev.type === "create" || ev.type === "update") cb(ev.data);
  });
}

export async function endRoom(roomId) {
  try { await base44.entities.MatchRoom.update(roomId, { status: "ended" }); } catch {}
}

export class Netplay {
  constructor(role, roomId) {
    this.role = role;
    this.roomId = roomId;
    this.lastSnapshot = null;
    this.lastGuestInput = { held: [], pressed: [], seq: 0 };
    this._snapAccum = 0;
    this._inputAccum = 0;
    this._inputSeq = 1;
    this._sub = subscribeRoom(roomId, (r) => this._onRoom(r));
    base44.entities.MatchRoom.get(roomId).then((r) => this._onRoom(r)).catch(() => {});
  }

  _onRoom(r) {
    if (!r) return;
    if (r.snapshot) { try { this.lastSnapshot = JSON.parse(r.snapshot); } catch {} }
    if (r.guest_input) {
      try {
        const gi = JSON.parse(r.guest_input);
        if (gi && gi.seq > this.lastGuestInput.seq) this.lastGuestInput = gi;
      } catch {}
    }
  }

  getRemoteInput() {
    return {
      held: new Set(this.lastGuestInput.held || []),
      pressed: new Set(this.lastGuestInput.pressed || [])
    };
  }

  sendInput(heldArr, pressedArr, dt) {
    this._inputAccum += dt;
    if (this._inputAccum < 3) return;
    this._inputAccum = 0;
    const seq = this._inputSeq++;
    base44.entities.MatchRoom.update(this.roomId, {
      guest_input: JSON.stringify({ held: heldArr, pressed: pressedArr, seq })
    }).catch(() => {});
  }

  sendSnapshot(snap, dt) {
    this._snapAccum += dt;
    if (this._snapAccum < 6) return;
    this._snapAccum = 0;
    base44.entities.MatchRoom.update(this.roomId, {
      snapshot: JSON.stringify(snap)
    }).catch(() => {});
  }

  stop() {
    if (this._sub) { this._sub(); this._sub = null; }
  }
}
