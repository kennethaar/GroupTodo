/* ---------- the facts themselves ----------
   One descriptor per line: the dim key, the pills, the raw text and what to do
   with it when the typing stops. No save means the line is a reading, not a
   value: there is nothing to type there. */
function statusCodeFromValue(v) {
  const s = trim(String(v || "")).toLowerCase();
  for (const c of STATUS_ORDER)
    if (s === c || s === STATUS_LABEL[c].toLowerCase() || s === STATUS_TEXT[c]) return c;
  for (const c of STATUS_ORDER) if (s.length > 2 && STATUS_TEXT[c].includes(s)) return c;
  return null;
}
