function viewLoose(c, passList) {
  c.classList.add("solwrap");
  const head = c.firstChild;
  const deck = looseDeck(), a = deck[0];
  c.append(el("aside", {class: "solside"}, head, passList,
    el("p", {class: "solhow"}, SOL_PASSES[SOL_PASSES.findIndex(p => p.k === "loose")].say),
    el("div", {class: "solcount"}, deck.length + " still loose" + (LOOSE.filed ? " · " + LOOSE.filed + " filed now" : "")),
    el("p", {class: "solhow"}, "Type to search. ↑ ↓ go through the list, Enter files the action there.")));
  const nextNo = SOL_PASSES.findIndex(p => p.k === "loose") + 1, next = SOL_PASSES[nextNo];
  if (!a) {
    c.append(emptyCard(el("div", {style: "font-size:34px"}, "🂡"),
      el("b", {}, LOOSE.skipped.size ? "The rest are left on their day pages." : "Every action has a home."), el("br"),
      LOOSE.skipped.size ? "They come round again next review." : "No action on a day page is outside a project or a responsibility.", el("br"), el("br"),
      el("button", {class: "btn primary", onclick: () => solGoPass(nextNo)}, "Deal pass " + (nextNo + 1) + ": " + next.name + " ›"),
      LOOSE.skipped.size ? " " : null,
      LOOSE.skipped.size ? el("button", {class: "textbtn", onclick: () => { LOOSE.skipped.clear(); render(); }}, "Ask the skipped ones again") : null));
    return c;
  }
  const all = looseTargets(a);
  const list = el("ol", {class: "lsopts"});
  let sel = 0, shown = [];
  const paint = () => [...list.children].forEach((li, i) => li.classList.toggle("on", i === sel));
  const fill = () => {
    const q = trim(LOOSE.q).toLowerCase();
    shown = q ? all.filter(t => t.title.toLowerCase().includes(q)) : all.slice(0, LOOSE_TOP);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.replaceChildren(...(shown.length ? shown.map((t, i) => el("li", {},
      el("button", {class: "nm", translate: "no", onclick: () => looseFile(a, t.path), onmouseenter: () => { sel = i; paint(); }}, t.title),
      el("span", {class: "chip"}, t.kind))) : [el("li", {class: "open"}, "Nothing matches.")]));
    paint();
  };
  const search = el("input", {type: "search", value: LOOSE.q, "aria-label": "Search projects and responsibilities",
    placeholder: "Search " + all.length + " projects and responsibilities",
    oninput: () => { LOOSE.q = search.value; sel = 0; fill(); },
    onkeydown: e => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (shown.length) { sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length; paint(); }
      } else if (e.key === "Enter") { e.preventDefault(); if (shown[sel]) looseFile(a, shown[sel].path); }
    }});
  fill();
  const day = dateIn(a.added);
  const here = (a.space || "") === (V.space || "");
  // The action itself, in the task panel, where its project, context and the rest can be set.
  const open = () => inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space));
  c.append(el("div", {class: "sdduel"},
    el("div", {class: "sdhead"}, el("span", {}, "Action 1 of " + deck.length), el("span", {}, LOOSE.filed ? LOOSE.filed + " filed now" : "")),
    el("h2", {class: "sdask"}, "Which project or responsibility does this belong to?"),
    el("div", {class: "solcard lscard"},
      el("h3", {translate: "no", class: "lsopen", title: "Open the action", onclick: open}, plainTitle(a.title)),
      el("div", {class: "t-meta"}, spaceBadge(a.space),
        el("span", {class: "chip"}, day ? "from the day page of " + humanDate(day) : "on a day page"),
        a.age != null ? el("span", {class: "chip"}, a.age + " days old") : null,
        a.state !== "TODO" ? el("span", {class: "chip"}, a.state) : null),
      el("div", {class: "t-meta"}, el("button", {class: "textbtn", onclick: open}, "Open the action"),
        el("button", {class: "textbtn", onclick: () => previewPage(a.space, a.path)}, "Open the day page"))),
    search, list,
    el("div", {class: "t-meta"},
      here ? el("button", {class: "btn", onclick: () => newProjectPrompt(p => looseFile(a, p), bareLineName(a.block))}, "＋ New project for it") : null,
      el("button", {class: "btn ghost", onclick: () => looseLetGo(a)}, "Let it go"),
      el("button", {class: "textbtn", onclick: () => looseSkip(a)}, "Leave it on the day page ›"))));
  requestAnimationFrame(() => { if (search.isConnected) search.focus({preventScroll: true}); });
  return c;
}
