function viewReflect() {
  const c = el("div", {class: "wrap"});
  const today = todayISO(), aims = intentions(), log = reflectLog(), picks = reflectPicks();
  c.append(vhead("Weekly review", "Reflect · week " + reflectWeek(), viewSeg("review")));

  c.append(el("div", {class: "group"}, "Intentions", el("span", {class: "plain"}, "· what this journal is for"),
    V.pages.has(INTENTIONS_PATH) ? el("button", {class: "textbtn", onclick: () => openPage(INTENTIONS_PATH)}, "Edit in the page") : null));
  c.append(el("div", {class: "card refaims"}, ...aims.length
    ? aims.map(t => el("div", {class: "dash-item", translate: "no", html: renderInline(t)}))
    : [el("input", {placeholder: "Add an intention for this area…", "aria-label": "Add an intention for this area",
        onkeydown: e => { if (e.key === "Enter" && trim(e.target.value)) { addIntention(e.target.value); render(); } }})]));

  c.append(el("div", {class: "group"}, "This week",
    el("span", {class: "plain"}, "· " + humanDate(shiftISO(today, 1 - REFLECT_DAYS)) + " – " + humanDate(today))));
  // How the week felt, by core feeling: the words are already in the shown language.
  const felt = weekFeelings(log);
  if (felt.length) c.append(el("p", {class: "reffeel", translate: "no"}, felt.map(([w, n]) => w + " " + n).join(" · ")));
  if (!log.length) c.append(emptyCard("No events or feelings on your day pages this week. " +
    "Start a line with o and a space for what happened, = and a space for how it felt."));
  const feed = el("div", {class: "reflog"});
  for (const d of log) {
    feed.append(el("div", {class: "refday"}, dayLong(d.day)));
    feed.append(el("div", {class: "card"}, ...d.items.map(b => {
      const way = picks.get(trim(blockProp(b, "id") || "").toLowerCase()) || null;
      const open = () => openBlockAt(V.space, d.path, b);
      return el("div", {class: "refitem"},
        el("div", {class: "backlink-subtree", tabindex: "0", title: "Open the day page at this line",
          onclick: e => { if (!e.target.closest("[data-link], [data-bref], a[href]")) open(); },
          onkeydown: e => { if (e.key === "Enter") open(); }}, backlinkSubtree(b)),
        el("div", {class: "refpick", role: "group", "aria-label": "Toward or away from your intentions"},
          fchip("+ Toward", way === "toward", () => setReflectPick(d.path, b, "toward")),
          fchip("− Away", way === "away", () => setReflectPick(d.path, b, "away"))));
    })));
  }
  c.append(feed);

  const r = reflectionBlock(false);
  c.append(el("div", {class: "group"}, "Reflection",
    el("span", {class: "plain"}, "· notes and to dos, on " + (r && !isWeekPath(r.path) ? dayLong(baseName(r.path)) : "this week's page"))));
  c.append(el("div", {class: "refnotes"}, r ? pageOutline(r.path, {branch: r.block.id})
    : el("div", {class: "card"}, el("button", {class: "newline", onclick: () => {
        const at = reflectionBlock(true), nb = newBlock({title: ""});
        (at.block.children = at.block.children || []).push(nb);
        touch(at.path); render(); focusBlock(nb.id);
      }}, el("span", {class: "bul", "aria-hidden": "true"}, "•"), "Write a note, or · and a space for a to do"))));
  // The last tab of the review hands back to the steps, where the review is marked done.
  c.append(el("p", {class: "review-next"}, el("button", {class: "btn primary review-onward", onclick: () => go("review", {sub: "steps"})}, "Steps ›")));
  return c;
}
