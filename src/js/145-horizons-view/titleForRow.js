/* Context and project links are already chips on the row, so hide them
   from the title text. The outline view still shows them Logseq-style. */
function titleForRow(title) {
  // The estimate is drawn as its own badge, by estHtml().
  return trim(withoutEst(title)
    .replace(/\[\[[_0123c]\/[^\]]+\]\]/g, "")
    .replace(/\s{2,}/g, " "));
}
