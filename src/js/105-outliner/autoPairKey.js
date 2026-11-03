/* Brackets come in pairs (#268): ( [ { puts the closing one in too, with the
   caret between. A selection, or the word the caret is in, gets the brackets
   around it and stays selected, so [ twice makes a [[link]]. Typing the
   closing bracket in front of the same one steps over it, and Backspace in
   an empty pair takes both away. */
function autoPairKey(e, txt) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return false;
  const t = lineText(txt), [from, to] = caretOffsets(txt);
  const put = (text, a, z) => {
    setHostText(txt, text, a);
    if (z !== a) setHostSelection(txt, a, z);
    txt.dispatchEvent(new Event("input", {bubbles: true}));
    e.preventDefault();
    return true;
  };
  const close = AUTO_PAIRS[e.key];
  if (close) {
    let a = from, z = to;
    if (a === z) {
      const word = /[\p{L}\p{N}_'-]/u;
      // Only inside a word: at its start or end a bracket just opens.
      if (a > 0 && a < t.length && word.test(t[a - 1]) && word.test(t[a])) {
        while (a > 0 && word.test(t[a - 1])) a--;
        while (z < t.length && word.test(t[z])) z++;
      }
    }
    return put(t.slice(0, a) + e.key + t.slice(a, z) + close + t.slice(z), a + 1, z + 1);
  }
  if (from === to && Object.values(AUTO_PAIRS).includes(e.key) && t[from] === e.key)
    return put(t, from + 1, from + 1);
  if (e.key === "Backspace" && from === to && from > 0 && AUTO_PAIRS[t[from - 1]] === t[from] && t[from])
    return put(t.slice(0, from - 1) + t.slice(from + 1), from - 1, from - 1);
  return false;
}
