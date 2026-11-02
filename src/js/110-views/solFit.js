/* A box grows around the point under the pointer (or the point of it nearest
   the pointer, while the pointer is still on its way), so the option you are
   on as it zooms stays where it is. It is only nudged as far as it takes to
   keep the grown box inside the window. */
/* Where along one side something of length `len` at `start` should grow from
   by `s` so the point `p` stays put, nudged only as far as it takes to stay
   between `min` and `max`. Too big to fit: its start edge stays in view. */
function solFit(p, start, len, min, max, s) {
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const f = clamp((p - start) / len, 0, 1);
  const hi = (start - min) / (len * (s - 1)), lo = (start + len * s - max) / (len * (s - 1));
  return clamp(lo <= hi ? clamp(f, lo, hi) : hi, 0, 1);
}
