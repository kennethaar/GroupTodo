function slugify(title) {
  const s = trim(title || "Untitled")
    .replace(/[\u0000-\u001f/\\:*?"<>|]/g, "-")
    .replace(/\s+/g, " ");
  return s === "" ? "Untitled" : s;
}
