function relChildPicker(parent) {
  // A context's children are other contexts, never the folder it is in.
  if (!parent.block && isContextPath(parent.path)) {
    /* Every context there is, with a page or only named on tasks, except
       this one, the ones already inside it and the folders it is in. */
    const me = parent.path.slice(DIRS.contexts.length + 1).replace(/\.md$/i, "");
    // What is in the folder already goes on the page, if it is not there yet.
    inSpace(parent.space, () => syncCtxChildren(parent.path));
    const names = inSpace(parent.space, () => contextList()).filter(n => n !== me &&
      !n.startsWith(me + "/") && !me.startsWith(n + "/"));
    // A room that is not a context yet is made right inside this one.
    const fresh = () => promptInput({
      title: "New context inside @" + me, label: "Name (no @, e.g. bathroom)", cta: "Create",
      onSave: v => inSpace(parent.space, () => {
        const made = makeContext(me + "/" + v);
        notify("@" + made + " is now inside @" + me + ".");
        render();
      }),
    });
    if (!names.length) { fresh(); return; }
    listPicker({
      title: "Put a context inside " + ctxName(parent), items: names, typeahead: true,
      label: n => "@" + n, onPick: n => inSpace(parent.space, () => {
        const path = contextPath(n);
        if (!V.pages.has(path)) putPage(path, pageTemplateFor("c", n));
        nestContext(parent, {path, space: V.space});
      }),
      footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); fresh(); }}, "+ New context inside @" + me),
    });
    return;
  }
  const rows = relAll().filter(r => r.space === parent.space && relId(r) !== relId(parent));
  listPicker({
    title: "Children of " + relTitle(parent), items: rows, typeahead: true,
    label: relTitle, detail: r => relRef(r), onPick: r => relAddParent(parent, r),
    footer: el("button", {class: "btn ghost", onclick: () => promptInput({
      title: "Edit children", label: "children::", value: relChildrenRaw(parent), cta: "Save",
      onSave: v => { childrenFact(parent).save(v); render(); },
    })}, "Edit / remove links"),
  });
}
