document.addEventListener("pointerdown", e => {
  dropLinkHold();
  LINK_HELD = false;
  const link = e.button === 0 && e.target.closest("[data-link]");
  if (!link) return;
  const at = {x: e.clientX, y: e.clientY}, ref = link.dataset.link;
  LINK_HOLD = {at, timer: setTimeout(() => {
    LINK_HOLD = null;
    const path = linkPagePath(ref);
    if (!path) return;
    LINK_HELD = true;
    previewPage(V.space, path);
  }, LINK_HOLD_MS)};
}, true);
document.addEventListener("pointermove", e => {
  if (LINK_HOLD && Math.hypot(e.clientX - LINK_HOLD.at.x, e.clientY - LINK_HOLD.at.y) > 8) dropLinkHold();
}, true);
for (const ev of ["pointerup", "pointercancel"]) document.addEventListener(ev, dropLinkHold, true);
// A finger held on a link asks for the phone's own menu as well; the page is the answer.
document.addEventListener("contextmenu", e => {
  if (LINK_HELD && e.target.closest("[data-link]")) e.preventDefault();
}, true);

/* ---------- a name rested on: ask them for an update ----------
   The mouse resting on a person's name for a moment brings a small card that
   opens the ask, with the line the name is on ticked. A mouse only: a finger
   has the line menu, and passing over names on the way somewhere shows
   nothing. Off the name and the card, it goes again. */
const ASK_HOVER_MS = 450, ASK_LEAVE_MS = 250;
let ASK_CARD = null, ASK_SHOW = null, ASK_HIDE = null;
const personOfLink = link => {
  const t = trim(link.dataset.link || "").split("][")[0];
  return /^p\//i.test(t) ? trim(t.slice(2)) : "";
};
