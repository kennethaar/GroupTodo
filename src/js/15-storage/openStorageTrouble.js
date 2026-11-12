/* The folder stopped answering (#364). Said in a dialog, not a toast that
   goes before it is read: where the work is now, that nothing is lost, and
   where the log went, which is saved by itself so there is something to look
   at afterwards. With another dialog open, a toast offers this one instead. */
function openStorageTrouble(rec, e) {
  const label = spaceLabel(rec.name);
  const where = rec.backend && rec.backend.kind === "http" ? "server" : "folder";
  const reason = storageReason(e);
  const file = saveAppLog("Cannot reach " + label + "'s " + where + ": " + reason);
  const show = () => modal({center: true, title: "The " + where + " stopped answering",
    body: el("div", {},
      el("div", {class: "field"}, el("b", {}, "Saved in this browser for now. Nothing is lost.")),
      el("div", {class: "field", style: "color:var(--fg2)"},
        label + ": " + reason + ". What you write goes to the " + where + " when it is back."),
      el("div", {class: "field", style: "color:var(--fg3);font-size:12.5px"},
        "Log saved to your downloads: " + file)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Later"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => { closeModal(); saveNow(); }}, "Try the " + where + " again"),
    ]});
  if ($("#modalRoot").firstChild) notify(label + "'s " + where + " stopped answering. Nothing is lost.", "warn", {label: "Details", run: show});
  else show();
}
