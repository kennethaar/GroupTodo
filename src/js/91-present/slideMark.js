/* The layout mark at the front of a slide line (#433), read from the raw
   title, and the words without it: "-> Q1" is a timeline point "Q1". A quote
   loses its quote marks; the slide draws its own. A "_ " in front hides the
   line (#467) and is no word of it: "_ -> Q2" is a timeline point "Q2". */
function slideMark(text) {
  const t = String(text || "").replace(/^_\s+/, "");
  for (const [re, layout] of SLIDE_MARKS) {
    const m = re.exec(t);
    if (!m) continue;
    let words = trim(m[1] ?? t.slice(m[0].length));
    if (layout === "hero") words = words.replace(/^["“”]([^"“”]+)["“”]$/, "$1");
    return {layout, words};
  }
  return {layout: null, words: t};
}
