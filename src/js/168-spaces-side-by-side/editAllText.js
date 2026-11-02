/* ---------- the markdown itself ----------
   Advanced mode can open the text behind a line (with its children) or a
   whole page and edit it as markdown, for the edits the outline makes slow. */
function editAllText(ctx) {
  const hit = ctx.id ? inSpace(ctx.space, () => findBlock(ctx.id)) : null;
  const page = inSpace(ctx.space, () => getPage(ctx.path));
  if (!page) return;
  const input = el("textarea", {"aria-label": "All text", style: "width:100%;min-height:55vh;font-family:var(--mono)"});
  input.value = hit ? serializeBlocks([hit.block]) : serializePage(page);
  const save = () => {
    inSpace(ctx.space, () => {
      const fresh = parsePage(input.value);
      if (hit) {
        const siblings = siblingsOf(page, hit.block), at = siblings.indexOf(hit.block);
        if (at < 0) return;
        siblings.splice(at, 1, ...fresh.blocks);
      } else {
        // A meeting taken out of the text is one you deleted.
        if (page._cal) calRemember(fresh, page._cal);
        putPage(ctx.path, fresh);
      }
      touch(ctx.path);
    });
    closeModal();
    render();
  };
  modal({
    title: hit ? "Edit this line and its children" : "Edit the whole file",
    body: el("div", {class: "field"}, input),
    foot: [
      el("button", {class: "btn ghost", style: "margin-right:auto", title: "To paste somewhere else", onclick: () =>
        navigator.clipboard.writeText(input.value).then(() => notify("Copied."), () => notify("Could not copy.", "warn"))}, "Copy"),
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Save"),
    ],
  });
}
