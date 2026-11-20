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
    /* The lines are the page's own lines (#425). The page the link sits on is
       a quiet eyebrow over them, which opens that page at the line; while the
       caret is in a line, it turns into a warning that says which page is
       being changed. A click on a line's words opens that page too (#453):
       writing here is for the keyboard, and a link, tick or chip still does
       its own thing. */
    const title = pageTitle(h.path);
    const open = e => { e.preventDefault(); e.stopPropagation(); jumpToSourceNode(h.path, h.block); };
    // Keep the caret in the line, so the redraw on leaving it cannot take
    // this button away before the click lands (#453).
    const keep = e => { if (e.button === 0) e.preventDefault(); };
    // The press keeps the caret out of the line; the click then opens the page.
    const onWords = e => {
      if (e.button !== 0 || e.target.closest("[data-link], [data-bref], a[href], img.asset, .pdf-fold, button")) return false;
      const txt = e.target.closest(".txt");
      return !!txt && txt !== document.activeElement;
    };
    const subtree = el("div", {class: "backlink-subtree"}, backlinkWithTrail(h, hideDone));
    subtree.addEventListener("mousedown", e => { if (onWords(e)) { e.preventDefault(); e.stopPropagation(); } }, true);
    subtree.addEventListener("click", e => { if (onWords(e)) open(e); }, true);
    card.append(el("div", {class: "backlink-entry"},
      el("button", {class: "bl-src", title: "Open " + title + " at this line", onmousedown: keep, onclick: open},
        el("span", {class: "bl-warn"}, "Editing: \""), title, el("span", {class: "bl-open"}, "\" · Open")),
      subtree
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
