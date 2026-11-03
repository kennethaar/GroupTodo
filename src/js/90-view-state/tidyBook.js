/* Every line of prose in every chapter, set in the style. Undo puts the pages back. */
function tidyBook() {
  const style = dialogueStyle();
  if (!style) return;
  const before = new Map(), changed = [];
  for (const ch of bookChapters()) {
    if (!ch.path) continue;
    const page = getPage(ch.path);
    let n = 0;
    const snap = structuredClone(page);
    walkBlocks(page.blocks, b => {
      if (b.state || isSceneHead(b) || parseTracker(b.title)) return b.state ? false : undefined;
      const t = tidyLine(b.title, style);
      if (t !== b.title) { b.title = t; n++; }
      b.body = (b.body || []).map(l => { const x = tidyLine(l, style); if (x !== l) n++; return x; });
    });
    if (n) { before.set(ch.path, snap); changed.push(ch.path); touch(ch.path); }
  }
  render();
  if (!changed.length) return notify("Nothing to tidy: the book is set in " + DIALOGUE[style].label + " already.");
  const space = V.space;
  notify("Tidied " + changed.length + (changed.length === 1 ? " chapter." : " chapters."), "info", {label: "Undo", run: () => inSpace(space, () => {
    for (const [p, snap] of before) { Object.assign(getPage(p), structuredClone(snap)); touch(p); }
    render();
  })});
}
