function bookTarget() {
  const n = parseInt(String(bookProps().target || "").replace(/[\s,.  ]/g, ""), 10);
  return n > 0 ? n : null;
}
