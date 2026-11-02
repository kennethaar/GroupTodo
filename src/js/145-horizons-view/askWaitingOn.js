/* Waiting is always waiting on somebody, so the moment a task turns to
   waiting it asks who. The people the task names come first. Skip leaves it
   waiting on nobody named; Waiting for lists that too. `set` turns it to
   waiting on saving, for the menu, where nothing has changed yet. */
function askWaitingOn(a, set = false) {
  const named = [...String(a.block.title).matchAll(/\[\[p\/([^\]]+?)\]/g)].map(m => trim(m[1]));
  const ppl = inSpace(a.space, () => allPeople().map(personName)).filter(n => !samePerson(n, whoAmI()));
  const ranked = [...new Map([...named, ...ppl].map(n => [slugPerson(n), n])).values()].slice(0, 12);
  const input = el("input", {placeholder: "A name", "aria-label": "Waiting for", value: assigneeOf(a.block) || ""});
  attachSuggest(input);
  // The countdown waits for the answer, so the row is still there to see it land.
  const hold = () => { const l = LINGER.get(a.block.id); if (l) l.until = Date.now() + LINGER_MS; };
  const save = name => {
    name = trim(name || "").replace(/^\[\[(?:p\/)?|\]\]$/g, "").replace(/\]\[.*$/, "");
    closeModal();
    inSpace(a.space, () => {
      if (name) assignBlock(a.path, a.block, name);
      else if (set) setBlockState(a.path, a.block, "WAIT");
    });
    hold(); render();
  };
  input.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (e.key === "Enter") { e.preventDefault(); save(input.value); }
  });
  modal({
    center: true, title: "Who are you waiting for?",
    body: el("div", {class: "field"},
      el("label", {}, plainTitle(a.title)), input,
      ranked.length ? el("div", {class: "opts", style: "margin-top:8px;display:flex;flex-wrap:wrap;gap:6px"},
        ...ranked.map(n => el("button", {class: "fchip", onclick: () => save(n)}, n))) : null),
    onClose: hold,
    foot: [el("button", {class: "btn ghost", onclick: () => save("")}, set ? "Nobody named" : "Skip"),
           el("button", {class: "btn primary", onclick: () => save(input.value)}, "Save")],
  });
  requestAnimationFrame(() => input.focus());
}
