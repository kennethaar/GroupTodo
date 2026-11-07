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
    const openSource = e => {
      if (e.target.closest("[data-link]")) return;
      e.preventDefault(); e.stopPropagation();
      if ((e.ctrlKey || e.metaKey) && h.block?.id) jumpToSourceNode(h.path, h.block);
      else openPage(h.path);
    };
    /* The page the link sits on is the container, so it is a quiet eyebrow
       over the lines, which get the card's whole width on any screen. */
    card.append(el("div", {
      class: "backlink-entry", tabindex: "0", onclick: openSource,
      onkeydown: e => { if (e.key === "Enter" || e.key === " ") openSource(e); }
    },
      el("button", {class: "bl-src", tabindex: "-1", onclick: openSource}, pageTitle(h.path)),
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
