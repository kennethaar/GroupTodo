function npmNav(q) {
  const qs = npmQs(NPM.step), last = NPM.q >= qs.length - 1;
  const to = last ? NPM_STEPS[NPM.step + 1] : null;
  const label = (q.done() ? "Next" : "Skip") + (to ? ": " + to.name : "") + " ›";
  return el("div", {class: "npmnav"},
    NPM.step || NPM.q ? el("button", {class: "btn ghost", onclick: npmBack}, "‹ Back") : null,
    el("span", {class: "npmgap"}),
    el("button", {class: "btn" + (q.done() ? " primary" : ""), title: "Ctrl+Enter", onclick: npmNext}, label));
}
