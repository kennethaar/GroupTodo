/* ((id)) in a line reads as the words of the line it points at. Clicking it
   goes there; the reference stays in the file as written. */
function blockRefHTML(id, hit) {
  const words = plainTitle(bujoText(hit.block.title).replace(/\(\([A-Za-z0-9_-]{4,64}\)\)/g, "…"))
    || "(an empty line)";
  return `<span class="bref" data-bref="${esc(id)}" contenteditable="false" title="${esc("From " + pageTitle(hit.path) + " - click to go there")}">${esc(words)}</span>`;
}
