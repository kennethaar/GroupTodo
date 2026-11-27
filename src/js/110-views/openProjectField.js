function openProjectField(r, k) {
  const f = solFields().find(x => x.k === k);
  if (!f) return;
  const body = el("div", {class: "solone"});
  SOL.more = null;
  SOL_EDIT = {
    redraw: () => { body.replaceChildren(solSlot(r, f)); },
    // A list of several stays open for the next pick; one answer is the end of it.
    after: () => {
      if (f.type === "multi") { SOL_EDIT.redraw(); render(); return; }
      SOL_EDIT = null; closeModal(); render();
    },
  };
  modal({center: true, title: f.label + " · " + inS(r, () => pageTitle(r.path)), body,
    /* Add, by the box, is what saves (#517). Done here only closed it, and
       took typed text with it: a box you type in says Cancel, one you pick
       from (each pick saves at once) a quiet Close. */
    foot: [el("button", {class: "btn", onclick: () => closeModal()}, f.type === "text" ? "Cancel" : "Close")],
    onClose: () => { SOL_EDIT = null; SOL.more = null; render(); }});
  SOL_EDIT.redraw();
  requestAnimationFrame(() => body.querySelector("input:not([type=date]):not(.newopt)")?.focus());
}
