/* The catch-up's changes (#516), one list grouped by project. Each change to
   what you have has the GTD choice for its kind, set to the likely one, so
   Apply needs no click; a project left with no next action stands out. Every
   new line (next action, to-do, project, a project's progress) comes last,
   under New lines, with a tick only and the project it is for: Apply puts them
   on today's page and starts a mini review of them (#516 follow-up). Back
   returns to the prompt and answer, which are kept. */
function catchUpReview(rows) {
  const day = iso => new Date(iso + "T12:00:00").toLocaleDateString([], {weekday: "short", day: "numeric", month: "short"});
  const task = r => plainTitle(r.block.title);
  const what = r => ({
    done: () => task(r),
    due: () => day(r.date) + ": " + task(r),
    note: () => (r.block ? task(r) : "Project") + ": “" + r.text + "”",
    next: () => r.text + (r.ctx ? " @" + r.ctx : ""),
    todo: () => r.text + (r.ctx ? " @" + r.ctx : "") + (r.date ? " · " + day(r.date) : ""),
    wait: () => (r.block ? task(r) + " — " + r.who : r.who + ": " + r.text) + (r.date ? " · by " + day(r.date) : ""),
    project: () => "Project: " + r.text + (r.outcome ? " — " + r.outcome : "") + (r.next ? " · first: " + r.next : ""),
  })[r.kind]();
  const isNew = r => ["project", "todo", "next"].includes(r.kind) || (r.kind === "note" && !r.block);
  const tick = (cls, label, checked, change, ...text) => {
    const box = el("input", {type: "checkbox", class: cls, "aria-label": label});
    box.checked = checked;
    box.addEventListener("change", () => change(box.checked));
    return el("label", {style: "display:flex;gap:8px;align-items:center;margin:0;min-width:0;flex:1 1 12em;font-weight:inherit"}, box, ...text);
  };
  const apply = el("button", {class: "btn primary", onclick: () => {
    closeModal();
    applyCatchUp(rows);
  }});
  const warn = text => el("span", {class: "cu-warn", style: "color:var(--warn);font-size:12px;white-space:nowrap"}, "⚠ " + text);
  const pick = (cls, label, options, value, change) => {
    const s = el("select", {class: cls, "aria-label": label, style: "width:auto;flex:none;font-size:12.5px;padding:2px 4px"},
      ...options.map(([v, n]) => el("option", {value: v}, n)));
    s.value = value;
    s.addEventListener("change", () => change(s.value));
    return s;
  };
  const list = el("div", {class: "field", style: "max-height:56vh;overflow:auto"});
  // A project is stuck when a task marked done leaves it with nothing open that moves it on.
  const stuck = proj => {
    const closing = new Set(rows.filter(r => r.proj === proj && r.kind === "done" && r.choice !== "skip").map(r => r.block));
    if (!closing.size) return false;
    const open = projectActions({space: V.space, path: proj}).some(a => OPEN_STATES[a.state] && !closing.has(a.block));
    const adding = rows.some(r => r.proj === proj && ["next", "wait"].includes(r.kind) && r.choice !== "skip");
    return !open && !adding;
  };
  const draw = () => {
    const groups = new Map();
    for (const r of rows) {
      const k = isNew(r) ? "\u0001new" : r.proj;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(r);
    }
    const keys = [...groups.keys()].sort((a, b) => (a === "\u0001new") - (b === "\u0001new"));
    list.replaceChildren(...keys.map(k => {
      const fresh = k === "\u0001new", mine = groups.get(k);
      // New lines: one tick for all of them, beside its name.
      const head = fresh ? el("div", {style: "display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;margin:12px 0 4px"},
        el("span", {style: "font-weight:600;font-size:13px"}, "New lines"),
        el("span", {class: "hint", style: "flex:1"}, "go on today's page; you sort them next"),
        el("label", {style: "display:flex;gap:6px;align-items:center;margin:0;font-size:12.5px"},
          Object.assign(el("input", {type: "checkbox", class: "cu-all", "aria-label": "Take all new lines"}), {
            checked: mine.every(r => r.choice !== "skip"),
            onchange: e => { for (const r of mine) r.choice = e.target.checked ? "take" : "skip"; draw(); }}),
          "All " + mine.length))
        : el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 4px"}, pageTitle(k));
      const g = el("div", {class: "cu-group"}, head,
        ...mine.map(r => {
          const row = el("div", {class: "cu-row", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 0 4px;font-size:13px" +
            (r.choice === "skip" ? ";color:var(--fg3)" : "")},
            ...(isNew(r) ? [tick("cu-take", "Take “" + r.text + "”", r.choice !== "skip", on => { r.choice = on ? "take" : "skip"; draw(); },
              el("span", {style: "min-width:0"}, what(r)),
              // The project it is for, quiet, as on the day page it goes to.
              r.proj ? el("span", {class: "hint", style: "white-space:nowrap"}, "→ " + pageTitle(r.proj)) : null)]
              : [pick("cu-do", "What to do", CATCHUP_CHOICES[r.kind], r.choice, v => { r.choice = v; draw(); }),
                el("span", {style: "min-width:0;flex:1 1 12em"}, what(r))]));
          // Where the AI found it, to check before you choose.
          if (r.url) row.append(el("a", {href: r.url, target: "_blank", rel: "noopener noreferrer", style: "flex:none;white-space:nowrap"},
            "↗ " + catchUpLinkKind(r.url)));
          return row;
        }));
      if (!fresh && stuck(k)) {
        const add = el("input", {class: "cu-add", placeholder: "Next action", "aria-label": "Next action for " + pageTitle(k),
          style: "flex:1;font-size:12.5px;padding:2px 6px;display:none"});
        add.addEventListener("keydown", e => {
          if (e.key !== "Enter" || !trim(add.value)) return;
          e.preventDefault();
          rows.push({kind: "next", proj: k, path: k, block: null, text: trim(add.value), ctx: "", url: null, choice: "take"});
          draw();
        });
        const btn = el("button", {class: "textbtn", type: "button", onclick: () => { btn.remove(); add.style.display = ""; add.focus(); }},
          "+ Add next action");
        g.append(el("div", {style: "display:flex;gap:8px;align-items:center;margin:6px 0 0 4px"}, warn("No next action left"), btn, add));
      }
      return g;
    }));
    // The changes and the new lines counted apart: the new ones are not done with yet.
    const taken = rows.filter(r => r.choice !== "skip"), fresh = taken.filter(isNew).length, n = taken.length - fresh;
    apply.textContent = fresh ? (n ? "Apply " + n + ", sort " + fresh + " new ›" : "Sort " + fresh + " new ›")
      : n === 1 ? "Apply 1 change" : "Apply " + n + " changes";
    apply.disabled = !taken.length;
  };
  draw();
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
