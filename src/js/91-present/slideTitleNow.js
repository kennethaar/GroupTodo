// Where a slide's title stands and how it looks, for slideGhost.
function slideTitleNow(title) {
  const r = title.getBoundingClientRect(), cs = getComputedStyle(title);
  return {rect: r, left: r.left, top: r.top, width: r.width, html: title.innerHTML,
    size: parseFloat(cs.fontSize), align: cs.textAlign};
}
