function addDoneComment(e, text) {
  const body = trim(text).replace(/\n+/g, " ");
  if (!body) return false;
  const ok = inSpace(e.space, () => {
    const t = doneTarget(e);
    if (!t) return false;
    const line = newBlock({title: "[[" + todayISO() + "]] " + linkKnownNames(body)});
    if (t.block) (t.block.children || (t.block.children = [])).push(line);
    else t.page.blocks.push(line);
    touch(t.path);
    return true;
  });
  if (ok) render();
  else notify("Could not find " + e.label + " any more. It may have been renamed or deleted.", "warn");
  return ok;
}
