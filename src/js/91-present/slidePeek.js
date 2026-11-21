/* A slide, small, beside a Present button while it is hovered or focused
   (#465): ▶ Present at the top, or ☰ › Present from here (`menuLine`, and
   beside the menu row, not under it). One slide at a time; the list under
   it (slidePeekChoices) says which, and ↑ ↓ on the button, ← → in the menu,
   or pointing at a choice switches. The slide is drawn as the deck draws it,
   scaled down. */
function slidePeek(anchor, path, root = null, menuLine = null) {
  if (DECK || !anchor || !anchor.isConnected) return;
  if (SLIDE_PEEK && SLIDE_PEEK.anchor === anchor) { clearTimeout(SLIDE_PEEK.timer); return; }
  const {choices, on} = slidePeekChoices(path, root, menuLine);
  if (!choices.length) return;
  slidePeekHide();
  const W = 240, k = W / innerWidth;
  const stage = el("div", {class: "peekstage", "aria-hidden": "true", style: `width:${W}px;height:${Math.round(innerHeight * k)}px`});
  const list = el("div", {class: "peeklist"}, ...choices.map((c, i) => el("button", {class: "peekpick", tabindex: "-1", "aria-pressed": "false",
    onpointerenter: e => { if (e.pointerType !== "touch") slidePeekPick(i); }, onclick: () => slidePeekPick(i)}, c.label)));
  const peek = el("div", {class: "slidepeek", id: "slidepeek", role: "group", "aria-label": "Slide preview",
    onpointerenter: () => clearTimeout(SLIDE_PEEK?.timer), onpointerleave: () => slidePeekLeave(),
    // A click on a choice keeps the focus where it is, so the preview stays.
    onmousedown: e => e.preventDefault()}, stage, list);
  peek._anchor = anchor;
  document.body.append(peek);
  SLIDE_PEEK = {anchor, peek, stage, choices, on: -1, timer: 0, own: [...(LOADED.get(V.space)?.css || new Map())]
    .filter(([p]) => isSlidesCssPath(p)).map(([, t]) => t).join("\n"), scale: k};
  slidePeekPick(on);
  anchor.setAttribute("aria-describedby", "slidepeek");
  // Under the button, or above it with no room; beside a menu row.
  const a = anchor.getBoundingClientRect(), p = peek.getBoundingClientRect(), m = 8;
  let x, y;
  if (menuLine) {
    x = a.right + m + p.width <= innerWidth ? a.right + m : a.left - m - p.width;
    y = a.top;
  } else {
    x = a.left;
    y = a.bottom + m + p.height <= innerHeight ? a.bottom + m : a.top - m - p.height;
  }
  peek.style.left = Math.max(m, Math.min(innerWidth - p.width - m, x)) + "px";
  peek.style.top = Math.max(m, Math.min(innerHeight - p.height - m, y)) + "px";
  // The button redrawn or the menu shut: the preview goes with it.
  const watch = () => {
    if (!peek.isConnected) return;
    if (!anchor.isConnected) { slidePeekHide(); return; }
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
}
