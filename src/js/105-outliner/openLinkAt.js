/* ---------- what the caret is sitting after ---------- */
/* An unclosed [[ immediately before the caret, and whatever has been typed
   since. A second [ or a closing ]] means this one is finished with. */
function openLinkAt(before) {
  if (before == null) return null;
  const at = before.lastIndexOf("[[");
  if (at < 0) return null;
  const q = before.slice(at + 2);
  if (/[\[\]\n]/.test(q)) return null;
  return {at, query: q};
}
