/* v1.171.0-v1.171.3 put a {{embed ((id))}} line on today's page for each task
   added straight to a project (#430). The day now lists such a task under its
   Linked References, by the task's Added:: date, so those lines go. Only a
   bare one goes: on a day page, with nothing under it, pointing at a task on
   another page. That task keeps the day as its Added:: date. */
function dropJournalEmbeds() {
  const ids = blockIdIndex();
  for (const [path, page] of V.pages) {
    if (!isJournalPath(path)) continue;
    const day = dayOfPath(path);
    const keep = page.blocks.filter(b => {
      const m = /^\{\{embed \(\(([0-9a-f-]{36})\)\)\}\}$/i.exec(trim(b.title || ""));
      if (!m || b.state || (b.children || []).length || (b.body || []).length) return true;
      const t = ids.get(m[1].toLowerCase());
      if (!t || t.path === path || isJournalPath(t.path) || !t.block.state) return true;
      if (!addedDate(t.block) && day) { setBlockProp(t.block, "Added", "[[" + day + "]]"); touch(t.path); }
      return false;
    });
    if (keep.length === page.blocks.length) continue;
    page.blocks = keep;
    touch(path);
  }
}
