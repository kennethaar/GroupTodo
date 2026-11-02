/* A typed clock -> "HH:MM", or null: 08:43, 8:43 and 8.43 as written,
   0843 or 843 the way a number pad types it, and 8 or 12 as the whole hour. */
function readClock(s) {
  const t = trim(String(s ?? ""));
  const m = /^(\d{1,2})[:.](\d{2})$/.exec(t) || /^(\d{1,2})(\d{2})$/.exec(t) || /^(\d{1,2})()$/.exec(t);
  if (m && !m[2]) m[2] = "00";
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return pad2(+m[1]) + ":" + m[2];
}
