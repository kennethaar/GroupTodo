async function openFolderCheck() {
  const name = V.space;
  const body = el("div", {}, el("div", {class: "field"}, "Reading the folder..."));
  modal({center: true, title: "Check the folder", body,
    foot: [el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: closeModal}, "Close")]});
  let r;
  try { r = await folderCheckReport(name); }
  catch (e) { body.replaceChildren(el("div", {class: "field"}, "Could not read the folder: " + storageReason(e) + ".")); return; }
  if (!r) { body.replaceChildren(el("div", {class: "field"}, "This area is not kept in a folder.")); return; }
  const list = (head, items) => items.length ? el("div", {class: "field"},
    el("label", {}, head + " (" + items.length + ")"),
    el("div", {style: "font:12px var(--mono);color:var(--fg2);white-space:pre-wrap;max-height:160px;overflow:auto"},
      items.slice(0, 40).map(x => Array.isArray(x) ? x[0] + " - " + x[1] : x).join("\n"))) : null;
  const fine = !r.notIn.length && !r.unlisted.length && !r.unread.length && !r.restError;
  body.replaceChildren(...[
    el("div", {class: "field"}, "“" + r.label + "” lists " + r.listed + " pages. " + r.pages + " are in the app." +
      (fine ? " Nothing is missing." : "")),
    r.restError ? el("div", {class: "field", style: "color:var(--warn)"}, "The last read stopped: " + r.restError) : null,
    list("In the folder, not in the app", r.notIn),
    list("Would not open", r.unread),
    list("Linked and in the folder, but not listed by it", r.unlisted),
    list("Linked, with no file", r.absent),
    el("div", {class: "field"},
      el("button", {class: "btn primary", onclick: async () => {
        closeModal();
        const rec = LOADED.get(name);
        if (!rec) return;
        await flush();
        await readInto(rec);
        restLoaded(rec);
        notify("Read " + rec.pages.size + " pages from “" + r.label + "”.");
        openFolderCheck();
      }}, "Read the folder again"),
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
        "Copy what is shown here into an issue on GitHub if pages are still missing."))].filter(Boolean));
}
