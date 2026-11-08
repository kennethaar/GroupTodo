/* The core feeling of a = line, from its first word on the wheel (#214):
   "= Let down, after the meeting" is Angry. Nothing is stored for it, so a
   change to the word list regroups every week. null off the wheel. */
function feelingCore(title) {
  if (bujoKind(title) !== "feel") return null;
  const text = trim(bujoText(title)).toLowerCase();
  let best = null;
  const walk = (ts, core) => ts.forEach(t => {
    const w = t.name.toLowerCase(), c = core || t.name;
    if ((text === w || (text.startsWith(w) && !/[\p{L}\p{N}]/u.test(text[w.length]))) && (!best || w.length > best.w.length)) best = {w, c};
    walk(t.kids, c);
  });
  walk(wordsForLines("="), null);
  return best ? best.c : null;
}
