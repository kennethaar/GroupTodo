function splitState(text) {
  const m = /^([A-Z]{3,9})(\s+|$)/.exec(text || "");
  if (!m) return [null, text || ""];
  const raw = m[1];
  const st = STATE_ALIAS[raw] || (TODO_STATES.includes(raw) ? raw : null);
  if (!st) return [null, text || ""];
  return [st, (text || "").slice(m[0].length)];
}
