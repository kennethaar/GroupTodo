function npmDraftRead(text) {
  const m = /```json\n([\s\S]*?)\n```/.exec(String(text || "").replace(/\r\n/g, "\n"));
  try { const d = m && JSON.parse(m[1]); return d && Array.isArray(d.ideas) ? d : null; } catch (_) { return null; }
}
