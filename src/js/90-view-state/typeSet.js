/* The text with the mark just typed (before the caret) set in the style, and
   where the caret goes; null when there is nothing to set. */
function typeSet(text, caret, style) {
  const st = DIALOGUE[style];
  if (!st || caret < 1) return null;
  const ch = text[caret - 1], before = caret > 1 ? text[caret - 2] : "";
  const put = (from, rep) => ({text: text.slice(0, from) + rep + text.slice(caret), caret: from + rep.length});
  if (ch === "\"") return put(caret - 1, !before || OPENS_AFTER.test(before) ? st.open : st.close);
  if (ch === "'") return put(caret - 1, /[\p{L}\p{N}]/u.test(before) ? "’" : !before || OPENS_AFTER.test(before) ? st.open1 : st.close1);
  if (ch === "." && text.slice(caret - 3, caret) === "...") return put(caret - 3, "…");
  if (ch === "-" && before === "-") return put(caret - 2, st.dash);
  if (st.line && ch === " " && caret === 2 && before === "-") return put(0, "– ");
  return null;
}
