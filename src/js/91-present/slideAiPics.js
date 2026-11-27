/* The pictures for Copy for AI ▸ Slides (#483), from the area's own
   assets/slides/: every name, those already on the area's other pages
   (used), and those whose names say nothing (unreadable). */
async function slideAiPics(path, space = V.space) {
  const rec = space && space !== V.space ? LOADED.get(space) : null;
  const be = rec ? rec.backend : V.backend;
  let names = [];
  try { names = be && typeof be.assetsIn === "function" ? await be.assetsIn(SLIDE_AI_DIR) : []; } catch (_) { names = []; }
  names = names.filter(n => ASSET_IMAGE_RE.test(n));
  SLIDE_AI_KNOWN.set(space || "", new Set(names));
  const have = new Set(names), used = new Set();
  inSpace(space, () => {
    for (const [p, page] of V.pages) if (p !== path) walkBlocks(page.blocks || [], b => {
      for (const line of [b.title, ...(b.body || [])]) for (const m of String(line || "").matchAll(SLIDE_AI_LINK_RE)) {
        const n = slideAiName(m[2]);
        if (have.has(n)) used.add(n);
      }
    });
  });
  return {names, used, unreadable: names.filter(slideAiUnreadable)};
}
