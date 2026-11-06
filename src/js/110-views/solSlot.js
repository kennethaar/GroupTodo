function solSlot(r, f) {
  const filled = f.filled(r);
  const slot = el("div", {class: "slot" + (filled ? " filled" : "") + (SOL.focus === f.k ? " focus" : ""),
    data: {solDrop: f.k + "~"}, tabindex: "0"},
    el("div", {class: "lbl"}, f.label, f.scoped ? spaceBadge(r.space) : null));
  if (filled && f.val) slot.append(el("div", {class: "val"}, f.val(r)));
  else if (filled && f.type === "multi") slot.append(el("div", {class: "val"}, f.cur(r).join(", ") || f.none));
  const opts = el("div", {class: "opts"});
  if (f.type === "text") {
    const input = el("input", {placeholder: f.ph, "aria-label": f.label});
    if (f.k === "outcome") input.value = f.val(r);
    attachSuggest(input);
    const send = () => { const v = trim(input.value); if (!v) return; f.submit(r, v); solAfter(r, f.k); };
    input.addEventListener("keydown", e => { if (suggestKey(e)) return; if (e.key === "Enter") { e.preventDefault(); send(); } });
    slot.append(el("div", {class: "slotform"}, input, el("button", {class: "btn sm", onclick: send}, f.k === "outcome" && filled ? "Save" : "Add")));
    /* A project's name is often already its outcome ("Website relaunched"),
       so it is offered from the start, three ways: accept it as it is, edit
       it in the box first, or write your own in the box. */
    const name = f.k === "outcome" ? inS(r, () => pageTitle(r.path)) : "";
    if (name && trim(input.value) !== name)
      slot.append(el("div", {class: "slotsuggest"},
        el("span", {}, "Suggestion: “" + name + "”"),
        el("div", {class: "opts"},
          el("button", {class: "fchip", data: {solPick: "accept"}, title: "Save the suggestion as it is",
            onclick: e => { e.stopPropagation(); f.submit(r, name); solAfter(r, f.k); }}, svgIcon(ICON_CHECK), " Accept"),
          el("button", {class: "fchip", data: {solPick: "edit"}, title: "Put the suggestion in the box to change before saving",
            onclick: e => { e.stopPropagation(); input.value = name; input.focus(); input.select(); }}, svgIcon(ICON_PENCIL), " Edit")),
        el("span", {class: "say"}, "or write your own in the box")));
    // With a suggestion the box offers three targets: the write row, Accept and Edit.
    if (name && trim(input.value) !== name) slot.querySelector(".slotform").dataset.solPick = "write";
    return slot;
  }
  if (f.type === "multi") {
    const cur = f.cur(r);
    solChoices(r, f, opts, f.opts(r), v => cur.includes(v), (v, label) => solOption(r, f, v, label, cur.includes(v)));
    opts.append(solOption(r, f, "none", f.none, !cur.length && !!solAns(r)[f.k]));
  } else {
    const cur = f.cur(r), now = f.now ? f.now(r) : null;
    solChoices(r, f, opts, f.opts(r), v => cur === v,
      (v, label) => solOption(r, f, v, label, cur === v, !solAns(r).status && now === v));
    if (f.type === "date") {
      const pickDate = el("input", {type: "date", min: todayISO(), "aria-label": "Pick a date",
        onchange: e => { if (e.target.value) { f.pick(r, e.target.value); solAfter(r, f.k); } }});
      opts.append(el("label", {class: "fchip datepick", data: {solDrop: f.k + "~date"}}, "📅 Pick a date", pickDate));
    }
  }
  /* A missing area or organisation can be made right here, as a page in the
     card's own space. */
  if (f.add) {
    const input = el("input", {class: "newopt", placeholder: "＋ " + f.add, "aria-label": f.add + " in " + r.space});
    input.addEventListener("keydown", e => {
      if (e.key !== "Enter" || !trim(input.value)) return;
      e.preventDefault(); f.make(r, trim(input.value));
      if (/^New /.test(f.add)) notify(f.add.replace(/^New /, "") + " “" + trim(input.value) + "” made in " + r.space + ".");
      solAfter(r, f.k);
    });
    opts.append(input);
  }
  slot.append(opts);
  return slot;
}
