// The file name in assets/slides/ a picture link points at (#483), %20 read as a space.
function slideAiName(src) {
  let n = String(src || "").replace(/^assets\/slides\//, "");
  try { n = decodeURIComponent(n); } catch (_) {}
  return n;
}
