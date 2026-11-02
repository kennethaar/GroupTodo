/* ============================================================
   169_EMBEDS_QUERIES_NAMESPACES_AND_MEETINGS
   Things the Logseq side of the app always had in Neovim: a line that shows
   another page or line in place ({{embed}}), a line that is a live list
   ({{query}}), a reference to one line from another (((id))), the family of
   pages a page belongs to, the value you wrote last time, duplicate lines
   taken out, and a word before a meeting starts.
   ============================================================ */

/* ---------- lines by their id:: ----------
   id:: is the durable name a line gets when something points at it: a copied
   link, an embed, a reference. Runtime ids are new on every read, so this is
   the only id that survives a reload. One map per area, rebuilt when anything
   is touched. */
function blockIdIndex() {
  return memo("blockIds\u0000" + (V.space || "") + "\u0000" + V.pages.size, () => {
    const by = new Map();
    for (const [path, page] of V.pages) walkBlocks(page.blocks, b => {
      const id = trim(blockProp(b, "id") || "").toLowerCase();
      if (id && !by.has(id)) by.set(id, {path, block: b});
    });
    return by;
  });
}
