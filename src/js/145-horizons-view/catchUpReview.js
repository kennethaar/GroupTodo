/* The catch-up's changes (#516), one list grouped by project, each ticked but
   a new project. The button says how many it makes. Back returns to the
   prompt and answer, which are kept. */
function catchUpReview(rows) {
  const day = iso => new Date(iso + "T12:00:00").toLocaleDateString([], {weekday: "short", day: "numeric", month: "short"});
  const task = r => plainTitle(r.block.title);
  const what = r => ({
    done: () => "Done: " + task(r),
    due: () => "Due " + day(r.date) + ": " + task(r),
    note: () => "Note on " + task(r) + ": “" + r.text + "”",
    next: () => "+ Next: " + r.text,
    wait: () => "+ Waiting for " + r.who + ": " + r.text + (r.date ? " · by " + day(r.date) : ""),
    project: () => r.text + (r.outcome ? " — " + r.outcome : "") + (r.next ? " · first: " + r.next : ""),
  })[r.kind]();
  const groups = new Map();
  for (const r of rows) {
    const k = r.kind === "project" ? "\u0001new" : r.proj;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  const keys = [...groups.keys()].sort((a, b) => (a === "\u0001new") - (b === "\u0001new"));
  const apply = el("button", {class: "btn primary", onclick: () => { closeModal(); applyCatchUp(rows); }});
  const count = () => {
    const n = rows.filter(r => r.on).length;
    apply.textContent = n === 1 ? "Apply 1 change" : "Apply " + n + " changes";
    apply.disabled = !n;
  };
  const list = el("div", {style: "max-height:56vh;overflow:auto"}, ...keys.flatMap(k => [
    el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 4px"}, k === "\u0001new" ? "New project" : pageTitle(k)),
    ...groups.get(k).map(r => {
      const box = el("input", {type: "checkbox", style: "width:auto;flex:none;margin:3px 0 0"});
      box.checked = r.on;
      box.addEventListener("change", () => { r.on = box.checked; count(); });
      return el("label", {style: "display:flex;gap:8px;align-items:flex-start;margin:4px 0 0 4px;text-transform:none;" +
        "letter-spacing:normal;font-size:13px;color:var(--fg);cursor:pointer"}, box, el("span", {style: "min-width:0"}, what(r)));
    }),
  ]));
  count();
  modal({
    center: true, title: "Catch up with an AI",
    body: list,
    foot: [
      el("button", {class: "btn ghost", onclick: openCatchUp}, "◂ Back"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      apply,
    ],
  });
}
