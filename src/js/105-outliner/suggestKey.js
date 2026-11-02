/* True when the key belonged to the list rather than to the text. A key the
   setting does not give to the list keeps its own meaning: Enter closes the
   list and ends the line, Tab indents. */
function suggestKey(e) {
  if (!SUGGEST || SUGGEST.host !== e.target) return false;
  const n = SUGGEST.rows.length;
  const word = SUGGEST.mode === "word";
  if (e.key === "Enter" && !e.shiftKey && suggestTakes("Enter", SUGGEST.mode)) {
    suggestAccept(); e.preventDefault(); return true;
  }
  if (e.key === "Enter") { suggestClose(); return false; }
  if (e.key === "ArrowDown" && !e.altKey) { SUGGEST.i = (SUGGEST.i + 1) % n; suggestDraw(); e.preventDefault(); return true; }
  if (e.key === "ArrowUp" && !e.altKey)   { SUGGEST.i = (SUGGEST.i - 1 + n) % n; suggestDraw(); e.preventDefault(); return true; }
  if (e.key === "Tab" && !e.shiftKey) {
    if (!suggestTakes("Tab", SUGGEST.mode)) { suggestClose(); return false; }
    suggestAccept(); e.preventDefault(); return true;
  }
  if (e.key === "Escape") {
    if (word) SUGGEST_DISMISSED = trim((textBeforeCaret(SUGGEST.host) || "").slice(SUGGEST.at)).toLowerCase();
    suggestClose(); e.preventDefault(); return true;
  }
  return false;
}
