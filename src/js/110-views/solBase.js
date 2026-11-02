/* Where a box sits when it is not enlarged, worked back from where it is
   drawn now: the scale may be anywhere in its 180ms transition. */
function solBase(box) {
  const r = box.getBoundingClientRect();
  const t = getComputedStyle(box).transform;
  const s = t && t !== "none" ? new DOMMatrixReadOnly(t).a || 1 : 1;
  const w = r.width / s, h = r.height / s, fx = +box.dataset.ox || 0.5, fy = +box.dataset.oy || 0.5;
  const left = r.left + fx * w * (s - 1), top = r.top + fy * h * (s - 1);
  return {left, top, right: left + w, bottom: top + h, width: w, height: h};
}
