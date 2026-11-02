/* ---------- renaming one ----------
   The name is the part of the key before the code, so renaming is rewriting
   that part on every line that carries it: every day page and every journal
   template, in every area, the code and the values left as they are. Renamed
   to a name already in use, the two become one history. */
function renameTrackerPrompt(name) {
  const input = el("input", {value: trackerTitle(name)});
  const note = el("div", {class: "hint"});
  const sync = () => {
    const to = trackerSlug(input.value);
    note.textContent = !to ? "Letters, numbers and dashes." : to === name ? ""
      : "Written as tracker-" + to + "_… on every day and template." +
        (trackerList().some(g => g.name === to) ? " " + trackerTitle(to) + " is already tracked: the two become one history." : "");
  };
  const save = () => {
    const to = trackerSlug(input.value);
    if (!to) { notify("Give it a name.", "warn"); input.focus(); return; }
    closeModal();
    if (to !== name) renameTracker(name, to);
  };
  input.addEventListener("input", sync);
  sync();
  modal({
    center: true, title: "Rename " + trackerTitle(name), hint: "the history comes along",
    body: el("div", {}, el("div", {class: "field"}, el("label", {}, "Name"), input, note)),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Rename")],
    onKey: e => { if (e.key === "Enter") { save(); return true; } return false; },
  });
  setTimeout(() => { input.focus(); input.select(); }, 30);
}
