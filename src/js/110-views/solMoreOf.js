/* The whole list of a question, searchable, over the table. */
function solMoreOf(r, f) {
  const body = el("div", {class: "solone"});
  SOL.more = f.k;
  if (f.type === "multi") SOL.hold = f.k;
  SOL_EDIT = {
    redraw: () => { body.replaceChildren(solSlot(r, f)); },
    // A list of several stays open for the next pick; one answer is the end of it.
    after: () => {
      if (f.type === "multi") { SOL_EDIT.redraw(); render(); return; }
      SOL_EDIT = null; closeModal(); solAfter(r, f.k);
    },
  };
  modal({center: true, title: SOL_ASK[f.k], body,
    foot: [el("button", {class: "btn primary", onclick: () => closeModal()}, "Done")],
    onClose: () => { SOL_EDIT = null; SOL.more = null; render(); }});
  SOL_EDIT.redraw();
}
