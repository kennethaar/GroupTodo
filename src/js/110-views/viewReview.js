function viewReview() {
  // Health is reached from the review's own links, not a tab of its own, so subNow() would turn it away.
  const sub = state.sub === "health" ? "health" : subNow();
  if (sub === "days") return viewDayReview();
  if (sub === "projects") return viewSolitaire();
  if (sub === "actions") return viewActSolitaire();
  if (sub === "reflect") return viewReflect();
  const c = el("div", {class: "wrap"});
  const last = dateIn(getSetting("last_review"));
  const groups = reviewSteps();
  const ticks = reviewTicks();
  const all = groups.flatMap(g => g.steps);
  const done = all.filter(s => ticks.has(s.key)).length;
  c.append(vhead("Weekly review", (last ? "Last done " + humanDate(last) : "Clear, current, creative") +
    " · " + done + " of " + all.length + " done", viewSeg("review")));
  if (sub === "health") { c.append(viewHealth()); return c; }
  /* The page follows David Allen's three parts: get clear, get current, get
     creative. Each part is one fold (see reviewFold) holding its steps, then
     the lists that part is done with, in his order -- in get current the
     action lists, the calendar back and ahead, waiting for, the projects. A
     section of your own list that is none of the three folds on its own,
     first. One step at a time: the first one not ticked says what it means
     and has its doors; the others are a line each. */
  const now = all.find(s => !ticks.has(s.key));
  let n = 0;
  const stepsCard = steps => el("div", {class: "card"}, ...steps.map(s => {
    const on = ticks.has(s.key), cur = s === now;
    const count = s.doors.map(reviewDoorCount).filter(Boolean).join(" · ");
    n++;
    return el("div", {class: "task rstep" + (on ? " done" : "") + (cur ? " now" : ""),
      onclick: () => s.doors.length ? goTour(s.doors[0]) : setReviewTick(s.key, !on)},
      el("button", {class: "rtick", role: "checkbox", "aria-checked": String(on), "aria-label": "Done: " + s.text,
        onclick: e => { e.stopPropagation(); setReviewTick(s.key, !on); }}, on ? "✓" : String(n)),
      el("div", {class: "t-body", style: "text-align:left"},
        el("div", {class: "t-title", translate: "no", html: renderInline(s.text)}),
        (cur && s.note) || (count && !on) ? el("div", {class: "t-meta"},
          cur && s.note ? el("span", {class: "rnote"}, s.note) : null,
          count && !on ? el("span", {class: "chip"}, count) : null) : null),
      ...(cur ? s.doors : []).map(id => el("button", {class: "textbtn", onclick: e => { e.stopPropagation(); goTour(id); }},
        tourLabel(id) + " ›")));
  }));
  // How far the steps have come and, where you are, the next one: said on the folded line.
  const progress = steps => {
    const left = steps.filter(s => !ticks.has(s.key)).length;
    return [el("span", {class: "plain"}, left ? "· " + (steps.length - left) + " of " + steps.length : "· ✓ all done"),
      steps.includes(now) ? el("span", {class: "plain rnext", translate: "no"}, "· next: " + now.text) : null];
  };
  const listFold = s => reviewFold("@" + s.title, {id: s.id ? "rsec-" + s.id : null},
    [s.title, el("span", {class: "plain"}, "· " + s.items.length + " · " + s.hint)],
    pagedCard(s.items, it => el("div", {class: "dash-item",
      onclick: () => it.block ? openTaskDetail(it.path, it.block) : previewPage(it.space || V.space, it.path)},
      el("span", {style: "flex:1;min-width:0", translate: "no", html: renderInline(it.text)}),
      // Where it is written, by the page's name rather than its file.
      el("span", {class: "p"}, /\.md$/.test(it.sub || "") ? baseName(it.sub) : it.sub || ""),
      el("button", {class: "fix", onclick: e => { e.stopPropagation(); it.act(); }}, it.fix)), "", 8));
  const phaseOf = g => REVIEW_PHASES.find(([k]) => new RegExp("\\b" + k + "\\b", "i").test(g.title || ""))?.[0];
  for (const g of groups.filter(g => !phaseOf(g))) {
    // A list without sections folds as one, under "Steps".
    const name = g.title || "Steps";
    c.append(reviewFold(name, {}, [name, ...progress(g.steps)], stepsCard(g.steps)));
  }
  const lists = reviewSections().filter(s => s.items.length);
  for (const [k, label] of REVIEW_PHASES) {
    const steps = groups.filter(g => phaseOf(g) === k).flatMap(g => g.steps);
    const mine = lists.filter(s => s.phase === k).map(listFold);
    if (k === "current") mine.splice(lists.filter(s => s.phase === k && s.kind === "actions").length, 0, reviewWeeks());
    if (!steps.length && !mine.length) continue;
    c.append(reviewFold("phase:" + k, {class: "rgroup rphase"}, [label, ...(steps.length ? progress(steps) : [])],
      steps.length ? stepsCard(steps) : null, ...mine));
  }

  // "The review is due" only leads back here, so it is not said on the review itself.
  const worth = attention().filter(nd => nd.id !== "review");
  if (worth.length) {
    c.append(reviewFold("@worth", {}, ["Worth a look", el("span", {class: "plain"}, "· " + worth.length),
      // A button in the headline does its own thing rather than folding it.
      el("button", {class: "textbtn", onclick: e => { e.preventDefault(); openNudgeExplainer(); }}, "Why these?")],
      el("div", {class: "card"}, ...worth.map(nd => el("button", {class: "task attn " + (nd.level || ""),
        title: NUDGE_WHY[nd.id] || "", onclick: nd.act || (() => {})},
        el("span", {class: "attn-n"}, nd.count != null ? String(nd.count) : "!"),
        el("div", {class: "t-body", style: "text-align:left"}, el("div", {class: "t-title"}, nd.label)),
        el("span", {class: "rnum"}, "›"))))));
  }
  // Broken links and lines written twice: the vault's own tidying, not a part of the review.
  const health = healthScan().length, twice = duplicateLinePages().length;
  if (health || twice) {
    const toHealth = label => el("button", {class: "fix", onclick: () => go("review", {sub: "health"})}, label);
    c.append(reviewFold("@tidy", {}, ["Housekeeping", el("span", {class: "plain"}, "· " + (health + twice))],
      el("div", {class: "card"},
        health ? el("div", {class: "dash-item"}, el("span", {style: "flex:1"}, health + " broken link" + (health === 1 ? "" : "s") +
          " or missing title" + (health === 1 ? "" : "s")), toHealth("fix")) : null,
        twice ? el("div", {class: "dash-item"}, el("span", {style: "flex:1"}, twice + (twice === 1 ? " page has" : " pages have") +
          " a line written twice"), toHealth("tidy")) : null)));
  }
  c.append(el("div", {style: "display:flex;gap:8px;margin-top:18px;align-items:center;flex-wrap:wrap"},
    el("button", {class: "btn primary", onclick: () => {
      setSetting("last_review", todayStamp());
      notify("Weekly review logged for " + humanDate(todayISO()) + ".");
      if (!celebrateReview()) render();
    }}, done === all.length && all.length ? "All done - mark the review done" : "Mark the review done"),
    el("button", {class: "textbtn", title: "The steps are the routine Weekly review in Settings", onclick: editReviewSteps}, "Edit the steps"),
    // Off is the whole celebration; quiet is the starfield without sound.
    el("button", {class: "textbtn", title: "The starfield after the review is marked done",
      onclick: () => { PREF.set("review.celebrate", {on: "quiet", quiet: "off", off: "on"}[PREF.get("review.celebrate", "on")] || "on"); render(); }},
      "Celebration: " + {on: "on", quiet: "no sound", off: "off"}[PREF.get("review.celebrate", "on")])));
  return c;
}
