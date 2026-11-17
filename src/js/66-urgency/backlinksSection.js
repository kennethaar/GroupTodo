function backlinksSection(path) {
  const all = backlinksTo(path);
  if (!all || !all.length) return null;
  /* Hide done (#321), the page's own filter on what links here, with its own
     switch: a hit on a closed line, or under one, goes with what is under it. */
  const closedHit = h => isClosedLine(h.block) || (h.trail || []).some(isClosedLine);
  const closed = all.reduce((n, h) => n + (closedHit(h) ? 1 : closedLineCount(h.block.children)), 0);
  const hideDone = closed > 0 && doneHidden(path, "links");
  const hits = hideDone ? all.filter(h => !closedHit(h)) : all;
  const space = V.space;
  const card = el("div", {class: "card"});
  for (const h of hits) {
    /* The lines are the page's own lines, written in here as there (#425).
       The page the link sits on is a quiet eyebrow over them, which opens
       that page at the line; while the caret is in a line, it turns into a
       warning that says which page is being changed. */
    const title = pageTitle(h.path);
    const open = e => { e.preventDefault(); e.stopPropagation(); jumpToSourceNode(h.path, h.block); };
    card.append(el("div", {class: "backlink-entry"},
      el("button", {class: "bl-src", title: "Open " + title + " at this line", onclick: open},
        el("span", {class: "bl-warn"}, "⚠ Editing on "), title, el("span", {class: "bl-open"}, " · Open ↗")),
      el("div", {class: "backlink-subtree"}, backlinkWithTrail(h, hideDone))
    ));
  }
  /* Folded under its heading until you open it. Opening or folding it once
     holds for every page, across reloads. */
  const key = "backlinks.open";
  return el("details", {class: "section quiet fold", style: "margin-top:36px;opacity:1",
      open: PREF.get(key, "0") === "1",
      ontoggle: e => PREF.set(key, e.currentTarget.open ? "1" : "0")},
    el("summary", {}, el("span", {}, "Linked References"), el("span", {class: "n"}, String(hits.length))),
    closed ? fbar(switchBtn("Hide done", hideDone, () => setDoneHidden(path, "links", !hideDone, space), closed)) : null,
    hits.length ? card : null);
}
