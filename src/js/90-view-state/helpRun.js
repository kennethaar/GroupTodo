/* The chooser under "Ways to run GroupToDo" (#290): tick what matters and
   what you cannot do, and the way that fits and how to start it show at once.
   The table under it shows what every way can do, so the advice can be
   checked, and marks the way this copy runs now. */
function helpRun() {
  const now = runWayNow();
  const best = el("div", {class: "runbest", role: "status", "aria-live": "polite"});
  const ticks = (legend, list) => el("fieldset", {class: "runticks"}, el("legend", {}, legend),
    ...list.map(([v, label]) => el("label", {}, el("input", {type: "checkbox", value: v, onchange: draw}), " ", label)));
  const needs = ticks("What matters to you", RUN_NEEDS), limits = ticks("What you cannot do", RUN_LIMITS);
  const on = fs => [...fs.querySelectorAll("input:checked")].map(i => i.value);
  function draw() {
    const [pick] = runWayPick(on(needs), on(limits));
    const w = RUN_WAYS[pick.id];
    best.replaceChildren(el("h3", {}, "Best for you"),
      el("p", {}, el("b", {}, w.title), pick.id === now ? " - you use this now." : ""),
      el("p", {}, w.good, " ", w.bad),
      pick.missing.length ? el("p", {class: "runmiss"}, "It cannot give you: " +
        pick.missing.map(n => RUN_NEEDS.find(x => x[0] === n)[1]).join("; ") + ".") : null,
      el("p", {}, el("b", {}, "Start: "), w.start));
  }
  const mark = yes => el("td", {class: yes ? "yes" : "no"}, el("span", {"aria-hidden": "true"}, yes ? "✓" : "–"),
    el("span", {class: "runsr"}, yes ? "Yes" : "No"));
  const table = el("div", {class: "runscroll"}, el("table", {class: "runtable"},
    el("thead", {}, el("tr", {}, el("th", {scope: "col"}, "Way"), ...RUN_NEEDS.map(n => el("th", {scope: "col", title: n[1]}, n[2])),
      el("th", {scope: "col"}, "Needs Python"))),
    el("tbody", {}, ...Object.entries(RUN_WAYS).map(([id, w]) => el("tr", {class: id === now ? "now" : null},
      el("th", {scope: "row"}, w.title, id === now ? el("span", {class: "runnow"}, " (now)") : null),
      ...RUN_NEEDS.map(n => mark(w.can.includes(n[0]))), mark(!!w.py))))));
  draw();
  return el("div", {class: "helprun"}, needs, limits, best, el("h3", {}, "Every way"), table);
}
