/* Where a slide's title stands and how it looks, for slideGhost: also each
   letter's place as the browser wrapped it, and its font (#431 reflow). */
function slideTitleNow(title) {
  const r = title.getBoundingClientRect(), cs = getComputedStyle(title);
  const letters = [], walk = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let n; (n = walk.nextNode());) {
    const fs = getComputedStyle(n.parentElement);
    for (let i = 0; i < n.data.length; i++) {
      if (/\s/.test(n.data[i])) continue;
      const range = document.createRange();
      range.setStart(n, i); range.setEnd(n, i + 1);
      letters.push({ch: n.data[i], rect: range.getBoundingClientRect(), size: parseFloat(fs.fontSize),
        font: fs.font, color: fs.color});
    }
  }
  return {rect: r, left: r.left, top: r.top, width: r.width, html: title.innerHTML,
    size: parseFloat(cs.fontSize), align: cs.textAlign, letters};
}
