/* Naming a new page is a line of text, so it is a line of text and not a form.
   The page is made in the space the node you dragged from lives in, which is
   the only space it could sensibly belong to. */
function plexNameModal(fromNode, after) {
  const input = el("input", {placeholder: "c/phone, p/Niclas, or just a name"});
  const done = () => {
    const name = trim(input.value);
    if (!name) { closeModal(); return; }
    closeModal();
    const path = createNodeFrom(fromNode, name);
    if (!path) return;
    notify("Made " + name + (fromNode ? " and linked it to " + fromNode.label : ""));
    after(path);
  };
  modal({
    center: true,
    title: "New page here",
    hint: fromNode ? "linked to " + fromNode.label : "",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Name"), input),
      el("div", {style: "font-size:12.5px;color:var(--fg3)"},
        "A prefix files it: c/ a context, p/ a person, o/ an org, z/ a note. " +
        "Without one it is a plain page.")),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: done}, "Make it"),
    ],
  });
  setTimeout(() => { input.focus(); input.onkeydown = e => { if (e.key === "Enter") done(); }; }, 0);
}
