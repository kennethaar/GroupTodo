function offerLineDraft() {
  const d = readLineDraft();
  if (!d || !trim(d.text)) { if (d) forgetLineDraft(); return; }
  if (!Spaces.get(d.space)) { forgetLineDraft(); return; }
  const rec = LOADED.get(d.space);
  // Its area is not open, or not writable yet: keep the copy for when it is.
  if (!rec || rec.hold || folderMissing(d.space)) return;
  if (document.querySelector("#modalRoot .modal")) return;
  const page = rec.pages.get(d.path);
  let target = null, landed = false;
  // The line editor holds the title only; the state sits on its own button.
  if (page) walkBlocks(page.blocks, blk => {
    if (trim(blk.title || "") === trim(d.text)) landed = true;
    if (!target && blk.title === d.base) target = blk;
  });
  if (landed) { forgetLineDraft(); return; }      // it was saved after all
  const where = page ? inSpace(d.space, () => pageTitle(d.path)) : "today's journal";
  modal({
    center: true,
    title: "A line you were typing was not saved",
    body: el("div", {},
      el("div", {class: "field"}, el("div", {style: "font-size:13.5px"},
        "The app closed before this line was written to " + where + ":")),
      el("div", {class: "field"}, el("div",
        {style: "font-size:13.5px;padding:8px 10px;border-left:3px solid var(--accent);background:var(--bg2)"},
        d.text)),
      el("div", {class: "field"}, el("div", {style: "font-size:12.5px;color:var(--fg3)"},
        target ? "Restoring puts it back on the line it was typed on."
               : "That line has changed since, so restoring adds it as a new line instead of writing over it.")),
    ),
    foot: [
      el("button", {class: "btn primary", onclick: () => { closeModal(); restoreLineDraft(d); }}, "Restore"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); forgetLineDraft(); }}, "Discard"),
    ],
  });
}
