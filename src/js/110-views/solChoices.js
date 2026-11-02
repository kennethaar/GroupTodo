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
  const search = el("input", {type: "search", placeholder: "Search " + ranked.length + " " + f.label.toLowerCase(),
    "aria-label": "Search " + f.label.toLowerCase(),
    oninput: () => {
      const q = trim(search.value).toLowerCase();
      let shown = 0;
      for (const b of box.children) { const hit = !q || b.textContent.toLowerCase().includes(q); b.hidden = !hit; shown += hit; }
      empty.hidden = shown > 0;
    },
    onkeydown: e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); SOL.more = null; solRedraw(); }
      else if (e.key === "Enter") { e.preventDefault(); const b = [...box.children].find(x => !x.hidden); if (b) b.click(); }
    }});
  for (const [v, label] of ranked) box.append(chip(v, label));
  host.append(el("div", {class: "solmorewrap"}, search, box, empty,
    el("button", {class: "textbtn", onclick: e => { e.stopPropagation(); SOL.more = null; solRedraw(); }}, "Show fewer")));
  requestAnimationFrame(() => { if (search.isConnected) search.focus({preventScroll: true}); });
}
