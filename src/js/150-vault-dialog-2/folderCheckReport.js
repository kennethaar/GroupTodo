/* ---------- what the folder holds that the app does not (#188) ----------
   On a phone, pages the app had written into the folder were missing from
   it, with nothing on screen to say why. This counts what was read, names
   what would not open, and asks the folder for every person a line links
   to by name, which tells a file the listing leaves out from one that is
   not there. Read again reads every file afresh. */
async function folderCheckReport(name) {
  const rec = LOADED.get(name);
  const b = rec && rec.backend;
  if (!b || b.kind !== "fs") return null;
  const listed = (await b.names()).filter(p => /\.md$/i.test(p) && !isGuidePath(p) && !isLangPath(p) && !isPromptPath(p) && !syncCopyOf(p));
  const notIn = listed.filter(p => !rec.pages.has(p));
  const linked = new Set();
  for (const page of rec.pages.values()) walkBlocks(page.blocks, blk => {
    for (const l of linksIn([blk.title, ...(blk.body || [])].join(" "))) {
      const t = trim(l.split("][")[0]);
      if (t.startsWith("p/")) linked.add(t);
    }
  });
  const unlisted = [], absent = [];
  for (const t of [...linked].slice(0, 400)) {
    const path = resolveWikiPath(t);
    if (rec.pages.has(path) || listed.includes(path)) continue;
    ((await b.readText(path)) != null ? unlisted : absent).push(path);
  }
  return {label: b.label, listed: listed.length, pages: rec.pages.size, notIn, unlisted, absent,
          unread: [...(b.unread || new Map())], restError: rec.restError ? String(rec.restError) : ""};
}
