/* "-7d", "today", "+2w", "2026-10-01", "[[2026-10-01]]" as a day. */
function queryDay(w) {
  const s = trim(String(w || "")).toLowerCase().replace(/^\[\[|\]\]$/g, "");
  const t = todayISO();
  if (!s || s === "today" || s === "now" || s === "i dag" || s === "idag") return t;
  if (s === "yesterday" || s === "i går") return shiftISO(t, -1);
  if (s === "tomorrow" || s === "i morgen") return shiftISO(t, 1);
  const iso = dateIn(s);
  if (iso) return iso;
  const m = /^([+-]?)(\d+)([dwmy])$/.exec(s);
  if (!m) return null;
  const n = (m[1] === "-" ? -1 : 1) * Number(m[2]);
  if (m[3] === "d") return shiftISO(t, n);
  if (m[3] === "w") return shiftISO(t, 7 * n);
  const d = parseISO(t);
  if (m[3] === "m") d.setMonth(d.getMonth() + n); else d.setFullYear(d.getFullYear() + n);
  return isoOf(d);
}
