function parseInvite(text) {
  const m = new RegExp("<!--\\s*" + INVITE_TAG + "\\s*(\\{[\\s\\S]*?\\})\\s*-->").exec(String(text).slice(0, 8000));
  if (!m) return null;
  try { const cfg = JSON.parse(m[1]); return cfg && cfg.space ? cfg : null; } catch (_) { return null; }
}
