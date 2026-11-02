function flyDraw() {
  if (!FLY) return;
  const {box, block} = FLY;
  const rows = flyRows();
  const waitingNobody = block.state === "WAIT" && (!assigneeOf(block) || samePerson(assigneeOf(block), whoAmI()));
  box.textContent = "";
  box.append(el("div", {class: "fhint"}, waitingNobody ? el("b", {}, "Waiting on whom? Pick the person below")
    : (block.state ? "Task" : "Note") + " · setting any of these makes the line a task"));
  rows.forEach((r, i) => {
    const open = FLY.open === r.k;
    const lit = FLY_LIT && FLY_LIT.id === block.id && FLY_LIT.k === r.k;
    const hi = FLY.summoned && !FLY.open && i === (FLY.row || 0);
    const row = el("div", {class: "frow" + (open ? " open" : "") + (lit ? " lit" : "") + (hi ? " hi" : "")},
      el("button", {class: "fhead", tabindex: "-1", onclick: () => flyHead(r.k)},
        el("span", {class: "fic bw"}, r.ic), el("span", {class: "fl"}, r.label),
        el("span", {class: "fv"}, r.val || ""), r.key ? el("kbd", {}, r.key) : null));
    if (open && r.opts) {
      const os = flyOptsOf(r), hi = Math.min(FLY.hi || 0, os.length - 1);
      const chip = ([v, l], i, text) => el("button", {class: "fchip" + (i === hi ? " hi" : ""), tabindex: "-1",
        onclick: () => flyPick(r.k, v)}, text || l);
      const opts = el("div", {class: "fopts"});
      if (r.k === "ctx") {
        /* A folder of contexts is a column: @PC on top, its children under it. */
        const folders = new Set((r.opts || []).map(o => o[0]).filter(v => v.includes("/")).map(ctxTop));
        const cols = new Map();
        os.forEach((o, i) => {
          const top = ctxTop(o[0]);
          if (!o[0] || !folders.has(top)) { opts.append(chip(o, i)); return; }
          let col = cols.get(top);
          if (!col) {
            col = el("div", {class: "fcol"});
            if (o[0] !== top) col.append(el("span", {class: "fcolhead"}, "@" + top));
            cols.set(top, col); opts.append(col);
          }
          const icon = contextIcon(o[0]);
          col.append(chip(o, i, o[0] === top ? null : (icon ? icon + " " : "") + o[0].slice(top.length + 1)));
        });
      } else os.forEach((o, i) => opts.append(chip(o, i)));
      if (!os.length) opts.append(el("span", {class: "fv"}, "Nothing called “" + FLY.q + "”"));
      if (r.date) {
        const d = el("input", {type: "date", tabindex: "-1", "aria-label": "Pick a date",
          onchange: e => { if (e.target.value) flyPick("due", e.target.value); }});
        opts.append(el("label", {class: "fchip datepick"}, "📅 Pick a date", d));
      }
      row.append(opts);
    }
    box.append(row);
  });
  box.append(el("div", {class: "fhint"}, FLY.open ? "↑ ↓ choose · Enter picks · Esc closes it"
    : FLY.summoned ? "↑ ↓ choose · Enter opens · Esc or Ctrl+. closes the menu"
    : "Enter new line · Tab indent · Shift+Tab outdent · Esc done"));
  box.hidden = flyHidden();
  const handle = FLY.txt.closest(".line")?.querySelector(":scope > .linemenu");
  if (handle) handle.setAttribute("aria-expanded", String(!box.hidden));
  flyPlace();
}
