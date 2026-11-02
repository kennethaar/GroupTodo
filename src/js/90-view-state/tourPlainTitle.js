/* The same line with the door written out in words. Links are followed from the
   page, and a link inside a dialog that cannot be followed is a lie. */
function tourPlainTitle(title) {
  return trim(String(title || "").replace(/\[\[go\/([A-Za-z0-9_-]+)(?:\]\[([^\]]*))?\]\]/g,
    (all, id, label) => trim(label || tourLabel(id))));
}
