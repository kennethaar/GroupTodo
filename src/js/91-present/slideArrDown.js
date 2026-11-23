/* Alt+drag on the slide (#487). A line or the title follows the pointer and
   snaps to the slide's thirds and centre; the picture pans in its frame.
   Let go and the place is kept. Alt+click without moving picks it for
   Alt+arrows. */
function slideArrDown(e) {
  if (!e.altKey || e.button !== 0 || !DECK || DECK.wait) return;
  const hit = slideArrOf(e.target), s = DECK.steps[DECK.i]?.s;
  const owner = hit && s && slideArrOwner(s, hit.kind, hit.id);
  if (!owner) return;
  e.preventDefault(); e.stopPropagation();
  const box = DECK.deck.querySelector(".slide.cur").getBoundingClientRect();
  const pic = hit.kind === "pic";
  const from = slideXY(owner.get()) || (pic ? [50, 50] : [0, 0]);
  const r = hit.node.getBoundingClientRect();
  // The element's centre with no move, in % of the slide, for the snap.
  const mid = [((r.left + r.width / 2 - box.left) / box.width) * 100 - from[0], ((r.top + r.height / 2 - box.top) / box.height) * 100 - from[1]];
  // How far a picture can pan: what is cut off of it, in px.
  let over = [0, 0];
  if (pic && hit.node.naturalWidth) {
    const k = Math.max(r.width / hit.node.naturalWidth, r.height / hit.node.naturalHeight);
    over = [hit.node.naturalWidth * k - r.width, hit.node.naturalHeight * k - r.height];
  }
  const at = ev => {
    const dx = ev.clientX - e.clientX, dy = ev.clientY - e.clientY;
    if (pic) return [0, 1].map(i => Math.max(0, Math.min(100, from[i] - (over[i] > 0 ? ([dx, dy][i] / over[i]) * 100 : 0))));
    return [0, 1].map(i => {
      const v = from[i] + ([dx, dy][i] / [box.width, box.height][i]) * 100;
      const near = SLIDE_SNAP.find(c => Math.abs(mid[i] + v - c) < SLIDE_SNAP_NEAR);
      return near == null ? v : near - mid[i];
    });
  };
  const draw = v => {
    if (pic) hit.node.style.objectPosition = `${v[0]}% ${v[1]}%`;
    else hit.node.style.translate = `${v[0]}cqw ${v[1]}cqh`;
  };
  let moved = false, last = from;
  const move = ev => {
    if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 3) return;
    moved = true;
    last = at(ev);
    draw(last);
  };
  const up = ev => {
    document.removeEventListener("pointermove", move, true);
    document.removeEventListener("pointerup", up, true);
    SLIDE_ARR = null;
    if (!moved) { SLIDE_ARR_PICK = {kind: hit.kind, id: hit.id}; return; }
    last = at(ev);
    const round = v => Math.round(v * 10) / 10;
    const v = last.map(round);
    SLIDE_ARR_PICK = {kind: hit.kind, id: hit.id};
    slideArrSave([[owner, !pic && !v[0] && !v[1] ? null : v.join(",")]], "Placed · Ctrl+Z puts it back.");
  };
  SLIDE_ARR = {hit};
  document.addEventListener("pointermove", move, true);
  document.addEventListener("pointerup", up, true);
}
