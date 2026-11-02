/* Dropping a page on a column's background changes what kind of page it is. */
function relTypeDrop(col, type) {
  col.addEventListener("dragover", e => {
    if (relDragged().some(r => !r.block)) { e.preventDefault(); col.classList.add("over"); }
  });
  col.addEventListener("dragleave", () => col.classList.remove("over"));
  col.addEventListener("drop", e => {
    const rows = relDragged().filter(r => !r.block);
    if (!rows.length) return;
    e.preventDefault();
    DRAGGED = null;
    if (type === "task") { notify("Drop onto a task card to make a child. Pages are not converted to tasks.", "warn"); return; }
    for (const r of rows) inSpace(r.space, () => {
      const dest = join(type === "project" ? DIRS.active : DIRS.zettel, baseName(r.path) + ".md");
      if (dest !== r.path) moveFile(r.path, dest);
      const page = getPage(dest);
      if (!page) return;
      if (type === "project") page.props.status = STATUS_TEXT["1"];
      else { delete page.props.status; page.props.type = "zettel"; }
      touch(dest);
    });
    render();
  });
}
