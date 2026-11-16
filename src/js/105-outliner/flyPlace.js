function flyPlace() {
  if (!FLY || FLY.box.hidden || !FLY.txt.isConnected) return;
  const {txt, box} = FLY;
  /* On a phone the on-screen keyboard covers the foot of the window, and the
     toolbar sits on top of it: the menu stops above both. */
  const vv = window.visualViewport, bar = $("#editBar");
  const M = 12, GAP = 6, vw = innerWidth, top0 = vv ? vv.offsetTop : 0;
  const vh = (vv ? Math.min(innerHeight, vv.offsetTop + vv.height) : innerHeight) -
    (bar && !bar.hidden ? bar.offsetHeight : 0);
  // The words themselves, not the line's box, which may run the full width.
  const r = document.createRange();
  r.selectNodeContents(txt);
  const tr = txt.getBoundingClientRect();
  let t = r.getBoundingClientRect();
  if (!t.width && !t.height) t = {left: tr.left, right: tr.left, top: tr.top, bottom: tr.bottom};
  // Where the words end: the right edge of the last wrapped row.
  const rows = r.getClientRects();
  const end = rows.length ? rows[rows.length - 1].right : t.right;
  box.style.maxHeight = "";
  const w = box.offsetWidth, h = box.offsetHeight;
  const clampX = x => Math.min(Math.max(M, x), Math.max(M, vw - w - M));
  let top, maxH = null;
  /* Opened from the ☰ in the gutter (#413): beside it, to its left, level with
     it; with no room there, just under it, starting at the ☰. */
  const from = FLY.from && FLY.from.isConnected ? FLY.from.getBoundingClientRect() : null;
  if (from) {
    const room = from.left - GAP - M >= w;
    const fx = room ? from.left - GAP - w : clampX(from.left);
    const fy = room ? from.top : from.bottom + GAP;
    const fmax = vh - M - fy;
    box.style.maxHeight = h > fmax ? Math.max(80, fmax) + "px" : "";
    box.style.left = Math.min(fx, from.left) + "px"; box.style.top = Math.max(top0 + M, Math.min(fy, vh - M - 80)) + "px";
    return;
  }
  const left = clampX(end);
  const below = vh - M - (t.bottom + GAP), above = t.top - GAP - M - top0;
  if (h <= below || below >= above) {
    top = t.bottom + GAP;
    if (h > below) maxH = Math.max(80, below);
  } else {
    top = Math.max(top0 + M, t.top - GAP - h);
    if (h > above) maxH = Math.max(80, above);
  }
  if (maxH != null) box.style.maxHeight = maxH + "px";
  box.style.left = left + "px"; box.style.top = top + "px";
}
