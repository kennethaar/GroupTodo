/* ↺ Reset slide (#487): every kept place on the slide on screen goes, its
   lines', its title's and its pictures' crops; one Ctrl+Z puts them back. */
function slideArrReset() {
  const s = DECK?.steps[DECK.i]?.s;
  if (!s) return;
  const owners = [slideArrOwner(s, "title")];
  walkBlocks([...(s.kids || []), ...(s.parts || []).filter(p => p && typeof p === "object" && p.id)], b => { owners.push(slideArrOwner(s, "line", b.id)); });
  for (const src of new Set([s.cover, ...(s.pics || [])].filter(Boolean))) owners.push(slideArrOwner(s, "pic", src));
  const moved = owners.filter(o => o && o.get());
  if (!moved.length) { notify("Nothing is moved on this slide."); return; }
  slideArrSave(moved.map(o => [o, null]), "The slide is as its layout puts it. Ctrl+Z puts the places back.");
}
