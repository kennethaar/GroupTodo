/* Which responsibility a line is for: one already there, or a new one. The
   line links it, in the area the picker was opened in, and then() runs after
   (#437, #439). Alt+I, Clarify and Review actions all ask it this way. */
function pickAreaFor(path, block, then = null) {
  const sp = V.space;
  const link = ref => {
    holdRender(() => inSpace(sp, () => insertMakeLink(path, block, ref)));
    if (then) then(); else render();
  };
  const fresh = () => newAreaPrompt(p => link(pageRef(p)));
  const bare = bareLineName(block);
  const {items, same} = rankedAreas(bare);
  if (!items.length) { fresh(); return; }
  listPicker({
    title: "Responsibility for this line",
    hint: bare ? "“" + bare + "” · type the name · enter picks · esc cancels" : "",
    items, typeahead: true,
    label: r => r.label,
    detail: r => r.path === null ? "new responsibility" : r === same ? "same name" : r.score > 0 ? "similar" : "",
    onPick: r => link(r.path ? inSpace(sp, () => pageRef(r.path)) : "a/" + slugify(r.label)),
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); fresh(); }}, "+ another name"),
  });
}
