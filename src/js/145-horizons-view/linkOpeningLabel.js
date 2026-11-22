/* "Opening Kitchen renovation at “Measure the window”…": the page by name,
   and the line once its page is in (#474). */
function linkOpeningLabel(link) {
  const b = link.block ? linkedBlock(link) : null;
  let words = b ? plainTitle(b.title || "").replace(/\s{2,}/g, " ").trim() : "";
  if (words.length > 60) words = words.slice(0, 59).trimEnd() + "…";
  return "Opening " + placeName(link.path) + (words ? " at “" + words + "”" : "") + "…";
}
