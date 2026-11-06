/* A merged context's old name, wherever Sense remembers it by name instead
   of by page -- here, away, work hours, a saved place, what it learned --
   so a merge does not come back on its own the next time it senses. Kept
   on this device, so a rename elsewhere in a shared vault leaves it alone;
   only a merge of the exact name it is holding moves it on. */
function senseRenameContext(from, to) {
  const hit = v => !!v && v.toLowerCase() === from.toLowerCase();
  if (hit(PREF.get("sense.here", ""))) PREF.set("sense.here", to);
  if (hit(PREF.get("sense.away", ""))) PREF.set("sense.away", to);
  try {
    const w = JSON.parse(PREF.get("sense.work", "{}"));
    if (hit(w.ctx)) PREF.set("sense.work", JSON.stringify({...w, ctx: to}));
  } catch (_) {}
  try {
    const places = JSON.parse(PREF.get("sense.places", "[]"));
    if (Array.isArray(places) && places.some(p => hit(p && p.ctx)))
      PREF.set("sense.places", JSON.stringify(places.map(p => p && hit(p.ctx) ? {...p, ctx: to} : p)));
  } catch (_) {}
  try {
    const log = JSON.parse(PREF.get("sense.learn", "[]"));
    if (Array.isArray(log) && log.some(o => o && o.k === "ctx" && hit(o.v)))
      PREF.set("sense.learn", JSON.stringify(log.map(o => o && o.k === "ctx" && hit(o.v) ? {...o, v: to} : o)));
  } catch (_) {}
}
