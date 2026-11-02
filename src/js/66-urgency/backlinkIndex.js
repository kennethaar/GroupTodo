/* Port of: init.lua 60_GRAPH_QUERIES

   Every page's links, read once per render. The boards ask backlinksTo for
   every card they draw, and reading the whole vault for each of 1600 cards is
   a couple of million block reads -- the Pages board and hierarchy froze for
   minutes on a vault that size. Each property and each line is filed under
   every target it names, in vault order, so asking about one page is a lookup. */
function backlinkIndex() {
  return memo("backlinks\u0000" + (V.space || "") + "\u0000" + V.pages.size, () => {
    const recs = [], by = new Map();
    const file = (rec, text) => {
      const source = String(text || "");
      const targets = new Set();
      const add = target => targets.add(target.split("][")[0].toLowerCase().replace(/\.md$/, ""));
      for (const l of linksIn(source)) add(l);
      // Match the same hashtag syntax used by renderInline. Hide wiki links
      // first so a hashtag inside a link label is not a second reference.
      const plain = source.replace(/\[\[[\s\S]*?\]\]/g, " ");
      for (const tag of plain.matchAll(/(^|\s)#([\p{L}\p{N}_\-/]+)/gu)) add(tag[2]);
      if (!targets.size) return;
      const i = recs.push(rec) - 1;
      for (const t of targets) {
        if (!by.has(t)) by.set(t, []);
        by.get(t).push(i);
      }
    };
    for (const [p, page] of V.pages) {
      for (const [k, v] of Object.entries(page.props || {})) file({path: p, prop: k, value: v}, v);
      const scan = (blocks, trail) => {
        for (const b of blocks || []) {
          file({path: p, block: b, trail}, [b.title, ...(b.body || [])].join("\n"));
          scan(b.children || [], [...trail, b]);
        }
      };
      scan(page.blocks, []);
    }
    return {recs, by};
  });
}
