/* Your person page in the area V points at, where your pins are kept; null
   when you have no name there, or while a big folder is still being read and
   the page is not in yet: read then, it looked as if you had no pins, and the
   next pin went over the ones on the page. */
function pinsHome() {
  const me = whoAmI();
  if (!me) return null;
  const path = personPath(me), rec = LOADED.get(V.space);
  if (rec && (rec.dayOnly || stillLoading(rec, path))) return null;
  return path;
}
