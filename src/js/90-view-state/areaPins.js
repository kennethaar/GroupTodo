/* The pins on your person page in the area V points at, as paths; null when
   there is no page to keep them on yet (pinsHome), so this device's stand in.
   Pins this browser kept before #33 (local) move onto the page the first time
   it is read. */
function areaPins(local = []) {
  const home = pinsHome();
  if (!home) return null;
  const paths = linksIn(getPage(home)?.props?.pins || "").map(r => findExistingPage(r) || resolveWikiPath(r));
  const moved = "pinsMoved:" + (V.space || "");
  if (PREF.get(moved)) return paths;
  PREF.set(moved, "1");
  const add = local.filter(p => !paths.includes(p));
  if (add.length) writeAreaPins([...paths, ...add]);
  return [...paths, ...add];
}
