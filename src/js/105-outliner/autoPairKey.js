/* Brackets come in pairs (#268): ( [ { puts the closing one in too, with the
   caret between. A selection, or the word the caret is in, gets the brackets
   around it and stays selected, so [ twice makes a [[link]]. Typing the
   closing bracket in front of the same one steps over it, and Backspace in
   an empty pair takes both away.
   Obsidian's marks and quotes do the same (#348), * _ = ~ ` " and ', but
   only in front of a word: inside one or after it they are plain characters,
   so don't, 5*3 and file_name type as written. * and _ twice make bold;
   = and ~ pair only from the second (==, ~~), since =12 and ~5 min are
   common. A selection is always wrapped. A space right after an opening
   mark takes its pair away again. quotes: false leaves " and ' to the
   book's own speech marks. Ctrl+B, Ctrl+I and Ctrl+Shift+H put ** * or ==
   round the selection or word, or take them off. */
function autoPairKey(e, txt, quotes = true) {
  if (e.altKey || e.isComposing) return false;
  const t = lineText(txt), [from, to] = caretOffsets(txt);
  const put = (text, a, z) => {
    // The line as it was is remembered first, so Ctrl+Z takes back the pair and no more.
    const ev = new InputEvent("beforeinput", {inputType: "insertText", bubbles: true, cancelable: true});
    ev.gtPair = true;
    txt.dispatchEvent(ev);
    setHostText(txt, text, a);
    if (z !== a) setHostSelection(txt, a, z);
    txt.dispatchEvent(new Event("input", {bubbles: true}));
    e.preventDefault();
    return true;
  };
  const word = /[\p{L}\p{N}_'-]/u;
  const wordAt = () => {
    let a = from, z = to;
    if (a === z && ((a > 0 && word.test(t[a - 1])) || (a < t.length && word.test(t[a])))) {
      while (a > 0 && word.test(t[a - 1])) a--;
      while (z < t.length && word.test(t[z])) z++;
    }
    return [a, z];
  };
  if (e.ctrlKey || e.metaKey) {
    const k = String(e.key || "").toLowerCase();
    const mark = !e.shiftKey && k === "b" ? "**" : !e.shiftKey && k === "i" ? "*" : e.shiftKey && k === "h" ? "==" : "";
    if (!mark) return false;
    const [a, z] = wordAt(), n = mark.length;
    const run = (i, step) => { let c = 0; while (t[i + c * step] === mark[0]) c++; return c; };
    const r = Math.min(run(a - 1, -1), run(z, 1));
    // Off when it is already round them: ** on ***x*** leaves *x*, * on it **x**.
    if (r === n || (mark[0] === "*" && r === 3))
      return put(t.slice(0, a - n) + t.slice(a, z) + t.slice(z + n), a - n, z - n);
    return put(t.slice(0, a) + mark + t.slice(a, z) + mark + t.slice(z), a + n, z + n);
  }
  const close = AUTO_PAIRS[e.key];
  if (close) {
    let a = from, z = to;
    if (a === z) {
      const inWord = /[\p{L}\p{N}_'-]/u;
      // Only inside a word: at its start or end a bracket just opens.
      if (a > 0 && a < t.length && inWord.test(t[a - 1]) && inWord.test(t[a])) {
        while (a > 0 && inWord.test(t[a - 1])) a--;
        while (z < t.length && inWord.test(t[z])) z++;
      }
    }
    return put(t.slice(0, a) + e.key + t.slice(a, z) + close + t.slice(z), a + 1, z + 1);
  }
  if (from === to && Object.values(AUTO_PAIRS).includes(e.key) && t[from] === e.key)
    return put(t, from + 1, from + 1);
  if (e.key === "Backspace" && from === to && from > 0 && AUTO_PAIRS[t[from - 1]] === t[from] && t[from])
    return put(t.slice(0, from - 1) + t.slice(from + 1), from - 1, from - 1);

  const marks = quotes ? PAIR_MARKS : PAIR_MARKS.replace(/["']/g, "");
  const opensAt = i => i <= 0 || /[\s([{]/.test(t[i - 1]) || PAIR_MARKS.includes(t[i - 1]);
  const free = from >= t.length || !/[\p{L}\p{N}]/u.test(t[from]);
  /* The run of one mark either side of the caret: *|* and **|** are empty
     pairs, opened where a mark may open. */
  const runs = m => {
    let n = 0, r = 0;
    while (from - n > 0 && t[from - n - 1] === m) n++;
    while (from + r < t.length && t[from + r] === m) r++;
    return [n, r, n > 0 && n === r && opensAt(from - n)];
  };
  if (from === to && (e.key === "Backspace" || e.key === " ") && from > 0 && marks.includes(t[from - 1])) {
    const [n, r, empty] = runs(t[from - 1]);
    if (empty && e.key === "Backspace") return put(t.slice(0, from - 1) + t.slice(from + 1), from - 1, from - 1);
    if (empty && e.key === " ") return put(t.slice(0, from) + " " + t.slice(from + r), from + 1, from + 1);
    return false;
  }
  const k = e.key;
  if (typeof k !== "string" || k.length !== 1 || !marks.includes(k)) return false;
  if (from !== to) return put(t.slice(0, from) + k + t.slice(from, to) + k + t.slice(to), from + 1, to + 1);
  const [n, r, empty] = runs(k);
  if (empty) return "*_=~".includes(k)
    ? put(t.slice(0, from) + k + k + t.slice(from), from + 1, from + 1)
    : put(t, from + 1, from + 1);
  // The closing mark in front of the caret: stepped over.
  if (r > 0 && t.slice(0, from).includes(k)) return put(t, from + 1, from + 1);
  if (!free) return false;
  if ("=~".includes(k))
    return n === 1 && opensAt(from - 1) ? put(t.slice(0, from) + k + k + k + t.slice(from), from + 1, from + 1) : false;
  return opensAt(from) ? put(t.slice(0, from) + k + k + t.slice(from), from + 1, from + 1) : false;
}
