function tidyLine(text, style) {
  const st = DIALOGUE[style];
  if (!st) return text;
  let out = "";
  for (const ch of text) {
    const before = out ? out[out.length - 1] : "", opening = !before || OPENS_AFTER.test(before);
    if (DOUBLE_MARKS.includes(ch)) out += opening ? st.open : st.close;
    else if (ch === "'") out += /[\p{L}\p{N}]/u.test(before) ? "’" : opening ? st.open1 : st.close1;
    else out += ch;
  }
  out = out.replace(/\.\.\./g, "…").replace(/--/g, st.dash);
  if (st.line) out = out.replace(/^-\s+/, "– ");
  return out;
}
