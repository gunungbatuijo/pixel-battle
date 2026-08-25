export const DEFAULT_KEYS = {
  forward: "KeyD",
  backward: "KeyA",
  jump: "KeyW",
  crouch: "KeyS",
  attack: "Space",
  skill1: "Digit1",
  skill2: "Digit2",
  skill3: "Digit3",
  block: "KeyQ",
  dash: "ShiftLeft",
  grab: "KeyE"
};

const STORAGE_KEY = "pixel_battle_keybinds";

export function loadKeybinds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_KEYS, ...JSON.parse(raw) };
  } catch (e) {}
  return { ...DEFAULT_KEYS };
}

export function saveKeybinds(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export const KEY_LABELS = {
  forward: "Move Forward",
  backward: "Move Backward",
  jump: "Jump",
  crouch: "Crouch",
  attack: "Attack",
  skill1: "Skill 1",
  skill2: "Skill 2",
  skill3: "Skill 3",
  block: "Block",
  dash: "Dash",
  grab: "Grab"
};

export function codeToLabel(code) {
  if (!code) return "—";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code === "Space") return "SPACE";
  if (code === "ShiftLeft") return "SHIFT";
  if (code === "ShiftRight") return "SHIFT";
  if (code === "Enter") return "ENTER";
  return code.replace("Arrow", "").toUpperCase();
}
