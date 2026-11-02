function npmRail() {
  const qs = NPM ? npmQs(NPM.step) : [];
  const steps = el("ol", {class: "solsteps", "aria-label": "Steps"}, ...NPM_STEPS.map((s, i) => {
    const now = NPM && i === NPM.step;
    // A step passed with nothing in it was skipped: no ✓, so it still looks open.
    const done = NPM && i < NPM.step && npmQs(i).some(q => q.done());
    const li = el("li", {}, el("button", {class: "solstep" + (now ? " now" : "") + (done ? " done" : ""),
      "aria-current": now ? "step" : null, disabled: NPM ? null : "disabled",
      title: NPM && i < NPM.step && !done ? "Skipped" : null,
      onclick: () => { if (NPM) { npmCommit(); npmGo(i); } }},
      el("span", {class: "n"}, done ? "✓" : String(i + 1)), el("span", {class: "q"}, s.name)));
    if (now && qs.length > 1) li.append(el("ol", {class: "npmsubq"}, ...qs.map((q, n) =>
      el("li", {}, el("button", {class: (n === NPM.q ? "now" : "") + (q.done() ? " done" : ""),
        onclick: () => { npmCommit(); npmGo(NPM.step, n); }},
        n === NPM.q ? "▸ " : q.done() ? "✓ " : "◦ ", q.label)))));
    if (now && NPM_STEPS[i].k === "next") {
      const waits = NPM.comps.filter(c => c.after && npmComp(c.after));
      if (waits.length) li.append(el("ol", {class: "npmsubq"}, ...waits.map(c =>
        el("li", {}, el("span", {class: "wait"}, "– " + c.name + " (after " + npmComp(c.after).name + ")")))));
    }
    return li;
  }));
  const side = el("aside", {class: "solside"},
    el("div", {class: "vhead"}, el("h1", {}, "Natural planning")),
    NPM ? el("div", {class: "npmproj"}, npmIn(() => pageTitle(NPM.path))) : null,
    NPM ? el("div", {class: "solcount"}, "Step " + (NPM.step + 1) + " of " + NPM_STEPS.length) : null,
    steps);
  if (NPM && !npmLocked()) side.append(
    el("button", {class: "btn primary npmfinish", title: "Writes what you have now. Undo takes it back.",
      onclick: npmWrite}, "✓ Finish & write page"),
    el("p", {class: "solhow"}, "Draft saved as you go."),
    el("p", {class: "solhow"}, NPM_STEPS[NPM.step].how));
  if (NPM) side.append(...[el("button", {class: "textbtn", title: "Esc", onclick: npmClose}, "Close: the draft is kept"),
    npmLocked() ? null : el("button", {class: "textbtn", onclick: npmThrowAway}, "Throw the draft away"),
    npmAskOn(NPM.space) ? null : el("button", {class: "textbtn",
      onclick: () => { PREF.set("npm.ask:" + (NPM.space || ""), "1"); notify("New projects ask again."); render(); }}, "Ask again on new projects")].filter(Boolean));
  const rest = NPM_QUEUE.filter(x => !NPM || x.path !== NPM.path || x.space !== NPM.space);
  if (rest.length) side.append(el("div", {class: "npmqueue"}, el("div", {class: "npmh"}, "Next to plan"),
    ...rest.map(x => el("button", {class: "textbtn", onclick: () => { if (NPM) { npmCommit(); npmSave(); } npmOpen(x.space, x.path); }},
      inSpace(x.space, () => pageTitle(x.path))))));
  return side;
}
