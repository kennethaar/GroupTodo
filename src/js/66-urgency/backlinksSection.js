function backlinksSection(path) {
  const hits = backlinksTo(path);
  if (!hits || !hits.length) return null;
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
      el("div", {class: "backlink-subtree"}, backlinkWithTrail(h))
    ));
  }
  /* Folded under its heading until you open it. Opening or folding it once
     holds for every page, across reloads. */
  const key = "backlinks.open";
  return el("details", {class: "section quiet fold", style: "margin-top:36px;opacity:1",
      open: PREF.get(key, "0") === "1",
      ontoggle: e => PREF.set(key, e.currentTarget.open ? "1" : "0")},
    el("summary", {}, el("span", {}, "Linked References"), el("span", {class: "n"}, String(hits.length))), card);
}
