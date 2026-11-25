/* Keys for placing on a slide (#487): Alt held shows what can move; with
   something picked by Alt+click, Alt+← ↑ → ↓ nudges it 1% (Shift: 5%).
   Gives true when the key was used. */
function slideArrKey(e) {
  if (!DECK || DECK.wait || DECK.edit) return false;
  if (e.type === "keyup") {
    if (e.key === "Alt") { slideArrShow(false); e.preventDefault(); return true; }
    return false;
  }
  if (e.key === "Alt") { if (!e.repeat) slideArrShow(true); e.preventDefault(); return true; }
  const dir = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[e.key];
  if (!e.altKey || !dir || !SLIDE_ARR_PICK) return false;
  const s = DECK.steps[DECK.i]?.s, o = s && slideArrOwner(s, SLIDE_ARR_PICK.kind, SLIDE_ARR_PICK.id);
  if (!o) return false;
  e.preventDefault(); e.stopImmediatePropagation();
  const pic = SLIDE_ARR_PICK.kind === "pic", step = e.shiftKey ? 5 : 1;
  // A map's pin (#488) moves from where it stands.
  const pin = SLIDE_ARR_PICK.kind === "line" && DECK.deck.querySelector(`.slide.cur .mpin[data-bid="${CSS.escape(String(SLIDE_ARR_PICK.id))}"]`);
  const v = slideXY(o.get()) || (pic ? [50, 50] : pin ? [parseFloat(pin.style.left), parseFloat(pin.style.top)] : [0, 0]);
  const next = v.map((x, i) => {
    const n = Math.round((x + dir[i] * step) * 10) / 10;
    return pic ? Math.max(0, Math.min(100, n)) : n;
  });
  slideArrSave([[o, next.join(",")]]);
  return true;
}
