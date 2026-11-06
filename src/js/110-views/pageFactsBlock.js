function pageFactsBlock(path, opts = {}) {
  if (opts.trackersOnly) return dayTrackersBlock(path);
  const hidden = hiddenKeys(path);
  const isHidden = f => f.prop && hidden.has(f.prop.toLowerCase());
  const all = pageFacts(path);
  const facts = all.filter(f => !isHidden(f)), tucked = all.filter(isHidden);
  // A tracker's page is there for its settings, so they are never folded away.
  const tracker = isTrackerPage(path);
  const folded = factsFolded(path) && !tracker;
  const toggle = () => { setFactsFolded(!folded); render(); };
  const keys = facts.map(f => f.key).filter(Boolean);
  const box = el("div", {class: "pfacts cols" + (folded ? " folded" : "") + (tracker ? " trkset" : "")},
    tracker ? null : el("button", {class: "pfhead", "aria-expanded": String(!folded),
      title: folded ? "Show the page's values" : "Fold the values away", onclick: toggle},
      el("span", {class: "pftog"}, svgIcon(folded ? ICON_CHEVRON_RIGHT : ICON_CARET)),
      el("span", {}, keys.length + (keys.length === 1 ? " value" : " values")),
      folded ? el("span", {class: "pfkeys"}, keys.join(" · ")) : null));
  if (folded) return box;
  const grid = el("div", {class: "pfgrid"});
  const withToggle = (f, hide) => {
    const line = factLine(path, f);
    if (f.prop) line.append(el("button", {class: "textbtn pfhide",
      title: hide ? "Hide this value under hidden values" : "Show this value again",
      "aria-label": (hide ? "Hide " : "Show ") + f.prop,
      onclick: () => setKeyHidden(path, f.prop, hide)}, hide ? "hide" : "show"));
    return line;
  };
  for (const f of facts) grid.append(withToggle(f, true));
  grid.append(newFactLine(path));
  box.append(grid);
  if (tucked.length) {
    const open = HIDDEN_OPEN.has(path);
    box.append(el("details", {class: "pfhidden", open: open ? "" : null,
      ontoggle: e => { if (e.target.open) HIDDEN_OPEN.add(path); else HIDDEN_OPEN.delete(path); }},
      el("summary", {}, tucked.length + " hidden " + (tucked.length === 1 ? "value" : "values")),
      el("div", {class: "pfgrid"}, ...tucked.map(f => withToggle(f, false)))));
  }
  return box;
}
