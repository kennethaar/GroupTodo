function solAskWaiting(r, after = null) {
  // Saving, skipping and Escape all end here, once.
  let ended = false;
  const finish = () => { if (ended) return; ended = true; if (after) after(); else render(); };
  // A line from the actions deck waits on somebody the same way, on the line itself.
  const task = !!r.block;
  const was = inS(r, () => waitingPersonName((task ? blockProp(r.block, "waiting_for") : getPage(r.path)?.props?.waiting_for) || ""));
  const input = el("input", {placeholder: "A name", "aria-label": "Waiting for"});
  input.value = was || "";
  attachSuggest(input);
  const save = name => {
    name = trim(name || "").replace(/^\[\[(?:p\/)?|\]\]$/g, "");
    if (name && task) holdRender(() => inS(r, () => {
      setBlockProp(r.block, "waiting_for", "[[p/" + name + "]]");
      setBlockState(r.path, r.block, "WAIT");
    }));
    else if (name) inS(r, () => {
      getPage(r.path).props.waiting_for = "[[p/" + name + "]]"; touch(r.path);
      const was = solKey(r), ans = SOL_ANS.get(was);
      r.path = shelveAsWaiting(r.path);
      if (ans && solKey(r) !== was) { SOL_ANS.delete(was); SOL_ANS.set(solKey(r), ans); }
    });
    closeModal(); finish();
  };
  input.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (e.key === "Enter") { e.preventDefault(); save(input.value); }
  });
  const ppl = inS(r, () => allPeople().map(personName).filter(n => !samePerson(n, whoAmI())));
  const ranked = [...new Set([...(task ? actPeople(r) : projectPeople(r)), ...ppl])].slice(0, 12);
  modal({
    center: true, title: "Who are you waiting for?",
    body: el("div", {class: "field"},
      el("label", {}, (task ? plainTitle(r.block.title) : inS(r, () => pageTitle(r.path))) + " is waiting on..."), input,
      el("div", {class: "opts", style: "margin-top:8px"},
        ...ranked.map(n => el("button", {class: "fchip", onclick: () => save(n)}, n)))),
    onClose: finish,
    foot: [el("button", {class: "btn ghost", onclick: () => { closeModal(); finish(); }}, "Skip"),
           el("button", {class: "btn primary", onclick: () => save(input.value)}, "Save")],
  });
  requestAnimationFrame(() => input.focus());
}
