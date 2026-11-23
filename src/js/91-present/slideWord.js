/* The layout word at the front of a line (#481): "(pyramid) What creates
   value" draws the line's lines as a pyramid. Only the known words, in any
   case, followed by a space; "(draft) Plan" is words. A hidden line's "_ "
   may come first (#467) and stays in `rest`, the line without the word. */
function slideWord(text) {
  const raw = String(text || ""), hid = /^_\s+/.exec(raw)?.[0] || "";
  const m = SLIDE_WORD_RE.exec(raw.slice(hid.length));
  const key = m && m[1].toLowerCase().replace("×", "x");
  const row = key && SLIDE_WORDS.find(([w]) => w === key);
  if (!row) return {layout: null, rest: raw};
  const [word, layout, icon, hint] = row;
  return {layout, word, icon, hint, name: SLIDE_LAYOUTS[layout].name, rest: hid + raw.slice(hid.length + m[0].length)};
}
