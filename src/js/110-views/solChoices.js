function solChoices(r, f, host, list, isOn, chip) {
  const fixed = list.filter(([v]) => v === "none");
  const rest = list.filter(([v]) => v !== "none");
  for (const [v, label] of fixed) host.append(chip(v, label));
  // Always ranked, short list or long: what is picked, then what this project is most connected to.
  const ranked = solRanked(r, f, rest, isOn);
  if (ranked.length <= SOL_TOP) { for (const [v, label] of ranked) host.append(chip(v, label)); return; }
  if (SOL.more !== f.k) {
    for (const [v, label] of ranked.slice(0, SOL_TOP)) host.append(chip(v, label));
    host.append(el("button", {class: "fchip more", onclick: e => { e.stopPropagation(); SOL.more = f.k; solRedraw(); }},
      "Show all " + ranked.length + " ›"));
    return;
  }
  const box = el("div", {class: "solmore"});
  const empty = el("div", {class: "say", hidden: true}, "Nothing matches.");
  // A word typed that nothing in the list is can be added as one (#519).
  const addNew = f.addNew ? el("button", {class: "fchip addnew", hidden: true,
    onclick: e => { e.stopPropagation(); solApply(r, f, addNew.dataset.v); }}) : null;
  const search = el("input", {type: "search", placeholder: "Search " + ranked.length + " " + f.label.toLowerCase(),
    "aria-label": "Search " + f.label.toLowerCase(),
    oninput: () => {
      const q = trim(search.value).toLowerCase();
      let shown = 0;
      for (const b of box.children) { const hit = !q || b.textContent.toLowerCase().includes(q); b.hidden = !hit; shown += hit; }
      empty.hidden = shown > 0;
      if (addNew) {
        const typed = trim(search.value);
        addNew.hidden = !/^[\p{L}\p{M}\-]+$/u.test(typed) || ranked.some(([v]) => String(v).toLowerCase() === q);
        if (!addNew.hidden) { const [v, label] = f.addNew(typed); addNew.dataset.v = v; addNew.textContent = label; empty.hidden = true; }
      }
    },
    onkeydown: e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); SOL.more = null; solRedraw(); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const b = [...box.children].find(x => !x.hidden) || (addNew && !addNew.hidden ? addNew : null);
        if (b) b.click();
      }
    }});
  for (const [v, label] of ranked) box.append(chip(v, label));
  const words = f.words ? f.words(r) : [];
  const own = words.length
    ? el("div", {class: "solwords"}, el("span", {class: "say"}, f.wordsSay), ...words.map(([v, label]) => chip(v, label)))
    : null;
  host.append(el("div", {class: "solmorewrap"}, own, search, box, addNew, empty,
    el("button", {class: "textbtn", onclick: e => { e.stopPropagation(); SOL.more = null; solRedraw(); }}, "Show fewer")));
  requestAnimationFrame(() => { if (search.isConnected) search.focus({preventScroll: true}); });
}
