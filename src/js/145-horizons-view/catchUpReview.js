/* The catch-up's changes (#516), one list grouped by project. Each row has
   the GTD choice for its kind, set to the likely one, so Apply needs no click;
   only what needs you stands out: a next action with no context, a project
   left with no next action, a new project past the limit. Back returns to the
   prompt and answer, which are kept. */
function catchUpReview(rows) {
  const day = iso => new Date(iso + "T12:00:00").toLocaleDateString([], {weekday: "short", day: "numeric", month: "short"});
  const task = r => plainTitle(r.block.title);
  const what = r => ({
    done: () => task(r),
    due: () => day(r.date) + ": " + task(r),
    note: () => task(r) + ": “" + r.text + "”",
    next: () => r.text,
    wait: () => r.who + ": " + r.text + (r.date ? " · by " + day(r.date) : ""),
    project: () => r.text + (r.outcome ? " — " + r.outcome : "") + (r.next ? " · first: " + r.next : ""),
  })[r.kind]();
  const contexts = contextList();
  const people = el("datalist", {id: "cu-people"}, ...[...new Set(allPeople().map(personName))].sort().map(n => el("option", {value: n})));
  const active = [...V.pages.keys()].filter(p => statusDirOf(p) === "1" && !isHorizonPage(p)).length;
  const apply = el("button", {class: "btn primary", onclick: () => {
    const nobody = rows.find(r => r.choice === "delegate" && !trim(r.who || ""));
    if (nobody) { notify("Say who “" + nobody.text + "” is delegated to.", "warn"); return; }
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
    const adding = rows.some(r => r.proj === proj && ((r.kind === "next" && ["next", "delegate"].includes(r.choice)) ||
      (r.kind === "wait" && r.choice !== "skip")));
    return !open && !adding;
  };
  const draw = () => {
    const groups = new Map();
    for (const r of rows) {
      const k = r.kind === "project" ? "\u0001new" : r.proj;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(r);
    }
    const keys = [...groups.keys()].sort((a, b) => (a === "\u0001new") - (b === "\u0001new"));
    list.replaceChildren(people, ...keys.map(k => {
      const g = el("div", {class: "cu-group"},
        el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 4px"}, k === "\u0001new" ? "New project" : pageTitle(k)),
        ...groups.get(k).map(r => {
          let opts = CATCHUP_CHOICES[r.kind];
          if (r.kind === "project") {
            const n = active + rows.filter(x => x.kind === "project" && x.choice === "active" && x !== r).length + 1;
            opts = opts.map(([v, l]) => v === "active" ? [v, l + " (" + n + " of " + CATCHUP_WIP + ")" + (n > CATCHUP_WIP ? " ⚠" : "")] : [v, l]);
          }
          const row = el("div", {class: "cu-row", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 0 4px;font-size:13px" +
            (r.choice === "skip" ? ";color:var(--fg3)" : "")},
            pick("cu-do", "What to do", opts, r.choice, v => { r.choice = v; draw(); }),
            el("span", {style: "min-width:0;flex:1 1 12em"}, what(r)));
          // Only a next action that waits on a list needs a place to be done; one done now or deferred does not.
          if (r.kind === "next" && r.choice === "next")
            // Said once, in the choice itself, and in the warning colour while it is empty.
            row.append(Object.assign(pick("cu-ctx", "Context", [["", "⚠ No context"], ...contexts.map(c => [c, "@" + c])], r.ctx || "",
              v => { r.ctx = v; draw(); }), r.ctx ? {} : {style: "width:auto;flex:none;font-size:12.5px;padding:2px 4px;color:var(--warn);border-color:var(--warn)"}));
          if (r.kind === "next" && r.choice === "delegate") {
            const who = el("input", {class: "cu-who", list: "cu-people", placeholder: "Who", "aria-label": "Delegated to",
              style: "width:10em;flex:none;font-size:12.5px;padding:2px 6px"});
            who.value = r.who || "";
            who.addEventListener("input", () => { r.who = who.value; });
            row.append(who);
          }
          // Where the AI found it, to check before you choose.
          if (r.url) row.append(el("a", {href: r.url, target: "_blank", rel: "noopener noreferrer", style: "flex:none;white-space:nowrap"},
            "↗ " + catchUpLinkKind(r.url)));
          return row;
        }));
      if (k !== "\u0001new" && stuck(k)) {
        const add = el("input", {class: "cu-add", placeholder: "Next action", "aria-label": "Next action for " + pageTitle(k),
          style: "flex:1;font-size:12.5px;padding:2px 6px;display:none"});
        add.addEventListener("keydown", e => {
          if (e.key !== "Enter" || !trim(add.value)) return;
          e.preventDefault();
          rows.push({kind: "next", proj: k, path: k, block: null, text: trim(add.value), ctx: "", url: null, choice: "next"});
          draw();
        });
        const btn = el("button", {class: "textbtn", type: "button", onclick: () => { btn.remove(); add.style.display = ""; add.focus(); }},
          "+ Add next action");
        g.append(el("div", {style: "display:flex;gap:8px;align-items:center;margin:6px 0 0 4px"}, warn("No next action left"), btn, add));
      }
      return g;
    }));
    const n = rows.filter(r => r.choice !== "skip").length;
    apply.textContent = n === 1 ? "Apply 1 change" : "Apply " + n + " changes";
    apply.disabled = !n;
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
