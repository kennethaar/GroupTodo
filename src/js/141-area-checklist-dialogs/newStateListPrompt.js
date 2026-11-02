function newStateListPrompt(then, name = "") {
  const nameInput = el("input", {placeholder: "Purchase", value: name});
  const stagesInput = el("textarea", {rows: "5", placeholder: STATE_LIST_STARTERS.Purchase.join("\n")});
  const create = () => {
    const t = trim(nameInput.value);
    const stages = String(stagesInput.value).split(/\r?\n/).map(trim).filter(Boolean);
    if (!t || !stages.length) { notify("A name and at least one stage.", "warn"); return; }
    if (V.pages.has(join(DIRS.lists, slugify(t) + ".md"))) { notify("There is already a list called " + t + ".", "warn"); return; }
    closeModal();
    const p = createStateList(t, stages);
    render();
    then ? then(p) : openPage(p);
  };
  modal({
    center: true, title: "New task type",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13px;line-height:1.5"},
          "The stages one task goes through. Ctrl+Enter on a task of this type moves it to the next one.")),
      el("div", {class: "field"}, el("label", {}, "Start from"),
        el("div", {class: "seg"}, ...Object.entries(STATE_LIST_STARTERS).map(([n, st]) =>
          el("button", {onclick: () => { nameInput.value = n; stagesInput.value = st.join("\n"); }}, n)))),
      el("div", {class: "field"}, el("label", {}, "Name"), nameInput),
      el("div", {class: "field"}, el("label", {}, "Stages, one per line"), stagesInput,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px;line-height:1.5"},
          "Put (to do), (doing), (waiting), (done) or (cancelled) after a stage to say what it counts as. " +
          "Without it the first counts as to do, the last as done, and the rest as doing."))),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: create}, "Create")],
  });
  setTimeout(() => (name ? stagesInput : nameInput).focus(), 30);
}
