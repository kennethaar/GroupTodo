function viewReflect() {
  const c = el("div", {class: "wrap"});
  const today = todayISO(), log = reflectLog(), picks = reflectPicks(), sc = intentionScores();
  const aims = intentionBlocks().map(b => ({id: trim(blockProp(b, "id") || "").toLowerCase(), title: trim(b.title)}));
  const signed = n => n > 0 ? "+" + n : n < 0 ? "−" + -n : "0";
  c.append(vhead("Weekly review", "Reflect · week " + reflectWeek(), viewSeg("review")));

  c.append(el("div", {class: "group"}, "Intentions", el("span", {class: "plain"}, "· what this journal is for"),
    V.pages.has(INTENTIONS_PATH) ? el("button", {class: "textbtn", onclick: () => openPage(INTENTIONS_PATH)}, "Edit in the page") : null));
  c.append(el("div", {class: "card refaims"}, ...aims.length
    ? aims.map(a => el("div", {class: "dash-item"}, el("span", {translate: "no", html: renderInline(a.title)}),
        el("span", {class: "refscore", title: "Toward adds one, away takes one"}, signed(a.id ? sc.total(a.id) : 0))))
    : [el("input", {placeholder: "Add an intention for this area…", "aria-label": "Add an intention for this area",
        onkeydown: e => { if (e.key === "Enter" && trim(e.target.value)) { addIntention(e.target.value); render(); } }})]));
  if (aims.length && sc.weeks.length > 1) c.append(el("div", {class: "card refchart"}, intentionChart(aims, sc)));

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
      const pick = picks.get(trim(blockProp(b, "id") || "").toLowerCase()) || null;
      const aim = pick?.aim && aims.find(a => a.id === pick.aim)?.title;
      const chip = (w, label) => { const on = pick?.way === w, ch = fchip(on && aim ? label + ": " + aim : label, on, () => pickReflectAim(d.path, b, w, pick));
        if (on && aim) ch.title = aim;
        return ch; };
      const open = () => openBlockAt(V.space, d.path, b);
      return el("div", {class: "refitem"},
        el("div", {class: "backlink-subtree", tabindex: "0", title: "Open the day page at this line",
          onclick: e => { if (!e.target.closest("[data-link], [data-bref], a[href]")) open(); },
          onkeydown: e => { if (e.key === "Enter") open(); }}, backlinkSubtree(b)),
        el("div", {class: "refpick", role: "group", "aria-label": "Toward or away from your intentions"},
          chip("toward", "+ Toward"), chip("away", "− Away")));
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
