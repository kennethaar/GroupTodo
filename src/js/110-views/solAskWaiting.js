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
  /* On a task, the question to ask them and a short summary, so the update
     you ask for later reads right to somebody who has not seen your notes
     (#344). Both can wait: Ask for an update offers them again. */
  const ask = (label, key, hint) => {
    const box = el("input", {placeholder: hint, value: task ? blockProp(r.block, key) || "" : ""});
    return {box, row: el("label", {style: "display:block;margin-top:10px;font-size:12.5px;color:var(--fg2)"}, label, box)};
  };
  const q = task ? ask("Question to ask them (optional)", ASK_Q_PROP, "One sentence they can answer") : null;
  const brief = task ? ask("Short summary (optional)", ASK_BRIEF_PROP, "What they need to recognise it") : null;
  const clean = name => trim(name || "").replace(/^\[\[(?:p\/)?|\]\]$/g, "");
  const save = name => {
    name = clean(name);
    if (name && task) holdRender(() => inS(r, () => {
      setBlockProp(r.block, "waiting_for", "[[p/" + name + "]]");
      for (const [f, key] of [[q, ASK_Q_PROP], [brief, ASK_BRIEF_PROP]])
        if (trim(f.box.value)) setBlockProp(r.block, key, trim(f.box.value));
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
        ...ranked.map(n => el("button", {class: "fchip", onclick: () => save(n)}, n))),
      ...(task ? [q.row, brief.row,
        el("button", {class: "btn sm ghost", style: "margin-top:8px", onclick: () => {
          const name = clean(input.value);
          if (!name) { notify("Put in who you are waiting for first.", "warn"); input.focus(); return; }
          save(name);
          openAskAI(name, [{space: r.space, path: r.path, block: r.block}]);
        }}, "Let AI write it")] : [])),
    onClose: finish,
    foot: [el("button", {class: "btn ghost", onclick: () => { closeModal(); finish(); }}, "Skip"),
           el("button", {class: "btn primary", onclick: () => save(input.value)}, "Save")],
  });
  requestAnimationFrame(() => input.focus());
}
