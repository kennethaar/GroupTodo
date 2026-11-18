/* A line's words with its layout mark swapped for another (#433), or taken
   off when layout is null. Steps writes the line's number (i counts from 0).
   Words in quotes keep their quotes: they are only a mark when typed so. */
function slideMarkSet(text, layout, i = 0) {
  const t = String(text || ""), m = slideMark(t);
  const words = m.layout && !/^["“”]/.test(t) ? m.words : t;
  const mark = !layout ? "" : layout === "process" ? i + 1 + ". "
    : (SLIDE_MENU.find(([k]) => k === layout) || [, , ""])[2] + " ";
  return trim(mark) ? mark + words : words;
}
