/* The step you were last on when you left a talk, on this device (#465):
   per area, page and, from ☰ › Present from here, the bullet's words (a
   line's id is new each time the page is read). With `i` it is noted;
   without, it is read back, or -1 when the talk was never shown. */
function slideLast(path, root = null, i = null) {
  const key = [V.space, path, root ? slideWords(root) : ""].join("\u0000");
  let all;
  try { all = JSON.parse(PREF.get("present.last", "{}")); } catch (e) { all = {}; }
  if (!all || typeof all !== "object" || Array.isArray(all)) all = {};
  if (i == null) return Number.isInteger(all[key]) ? all[key] : -1;
  delete all[key];
  // The newest first, so the oldest go when there are too many.
  PREF.set("present.last", JSON.stringify(Object.fromEntries([[key, i], ...Object.entries(all)].slice(0, 100))));
  return i;
}
