function openNextTwins() {
  const groups = nextTwins();
  if (!groups.length) { notify("No next actions look alike."); return; }
  const plans = groups.map(g => ({g, keep: null, not: false}));
  const applyBtn = el("button", {class: "btn primary", onclick: () => apply()});
  const count = () => {
    const n = plans.filter(p => p.keep || p.not).length;
    applyBtn.textContent = n ? "Apply " + n : "Apply";
    applyBtn.disabled = !n;
  };
  const apply = () => {
    closeModal();
    const not = twinNotSame(), snaps = new Map();
    let gone = 0;
    for (const p of plans) {
      if (p.not) for (let i = 0; i < p.g.rows.length; i++)
        for (let j = i + 1; j < p.g.rows.length; j++) not.add(twinPairKey(p.g.rows[i].title, p.g.rows[j].title));
      else if (p.keep) gone += foldNextTwins(p.g.rows, p.keep, snaps);
    }
    PREF.set("twins.not", JSON.stringify([...not]));
    clearMemo(); render();
    if (!gone) return;
    const undo = () => {
      for (const x of snaps.values()) inSpace(x.space, () => { putPage(x.path, parsePage(x.text)); touchHere(x.path); });
      clearMemo(); render();
      return true;
    };
    pushUndo({run: undo});
    notify("Took out " + gone + " look-alike" + (gone === 1 ? "" : "s") + ". What was under them is kept.",
      "info", {label: "Undo", run: undo});
  };
  const body = el("div", {class: "twins"});
  plans.forEach((p, gi) => {
    const rowsEl = el("div", {class: "twinrows"}), actEl = el("div", {class: "twinacts"});
    // Clicking the choice already made takes it back, as on Projects.
    const draw = () => {
      rowsEl.textContent = "";
      for (const r of p.g.rows) {
        const here = p.keep === r;
        rowsEl.append(el("label", {class: "twinrow" + (here ? " keep" : "")},
          el("input", {type: "radio", name: "ntwin-" + gi, checked: here,
            onclick: () => { p.keep = here ? null : r; p.not = false; draw(); count(); }}),
          el("span", {class: "twint"}, r.title),
          r.project ? el("span", {class: "chip proj"}, r.project) : null,
          multiSpace() ? spaceBadge(r.space) : null,
          el("button", {class: "textbtn", onclick: e => { e.preventDefault(); closeModal(); openBlockAt(r.space, r.path, r.block); }}, "Open")));
      }
      actEl.textContent = "";
      actEl.append(el("label", {class: "space-transfer-choice"},
        el("input", {type: "radio", name: "ntwin-" + gi, checked: p.not,
          onclick: () => { p.not = !p.not; p.keep = null; draw(); count(); }}), " Not the same"));
    };
    draw();
    body.append(el("div", {class: "twingroup"},
      el("div", {class: "twinwhy"}, p.g.rows.length + " next actions with " + p.g.why + ". Pick the one to keep:"),
      rowsEl, actEl));
  });
  count();
  modal({title: "Next actions that look alike", body,
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Close"), applyBtn]});
}
