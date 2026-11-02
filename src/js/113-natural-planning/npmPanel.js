/* ---------- the plan on the project's page ----------
   Where it is going, why, and what to do now, answered at a glance. Only on
   a page that has been planned; the rest of the page is the outline as ever.
   At most five actions, so it stays something you can take in. */
function npmPanel(path) {
  const page = getPage(path);
  if (!page) return null;
  const heads = new Map((page.blocks || []).map(b => [npmHeadOf(b), b]).filter(([k]) => k));
  if (!page.props?.planned && !heads.size) return null;
  const why = heads.get("purpose")?.children || [];
  const purpose = trim(page.props?.purpose || "") || why.map(b => trim(b.title)).filter(t => /^why:/i.test(t)).map(t => trim(t.slice(4))).join(" · ");
  const rules = (why.find(b => /^principles:?$/i.test(trim(b.title)))?.children || []).map(b => trim(b.title)).filter(Boolean);
  const outcome = outcomeOf(path);
  const rows = [];
  rows.push(el("div", {class: "npmrow"}, el("span", {class: "k"}, "Outcome"),
    outcome ? el("span", {class: "v"}, "✓ " + outcome) : el("span", {class: "chip miss"}, "No outcome yet")));
  if (purpose) rows.push(el("div", {class: "npmrow"}, el("span", {class: "k"}, "Purpose"), el("span", {class: "v"}, purpose)));
  if (rules.length) rows.push(el("div", {class: "npmrow"}, el("span", {class: "k"}, "Principles"), el("span", {class: "v"}, rules.join(" · "))));
  // The first open step of each component, and the steps of its own: what can be done now.
  const comps = (heads.get("comps")?.children || []).filter(b => /^###\s+/.test(trim(b.title)));
  const firsts = new Set(comps.map(b => flattenBlocks(b.children || []).find(x => OPEN_STATES[x.state])).filter(Boolean));
  for (const b of page.blocks || []) if (!npmHeadOf(b) && OPEN_STATES[b.state]) firsts.add(b);
  const ready = openOf(projectActions({space: V.space, path})).filter(a => firsts.has(a.block));
  if (ready.length) rows.push(el("div", {class: "npmh"}, "Next actions · " + ready.length + " ready"),
    // On its own page the project's name on every row says nothing.
    taskCard(ready.slice(0, 5).map(a => ({...a, project: null}))), ready.length > 5 ? el("div", {class: "npmsay"}, "+ " + (ready.length - 5) + " more below") : null);
  if (comps.length) {
    const names = comps.map(b => npmNum(trim(b.title).replace(/^###\s+/, "")));
    rows.push(el("div", {class: "npmcomps"}, el("div", {class: "npmh"}, "Components"), ...comps.map((b, n) => {
      const tasks = flattenBlocks(b.children || []).filter(x => x.state);
      const done = tasks.filter(x => x.state === "DONE" || x.state === "CANCELLED").length;
      const open = tasks.some(x => OPEN_STATES[x.state]);
      const after = npmNum(b.props?.after);
      const waits = after && names.some(x => x.toLowerCase() === after.toLowerCase());
      const add = () => npmOpen(V.space, path);
      return el("div", {class: "npmcomp"},
        el("span", {class: "nm"}, (n + 1) + ". " + names[n]),
        tasks.length ? el("span", {class: "pbar", title: done + " of " + tasks.length + " done"},
          el("i", {style: "width:" + Math.round(100 * done / tasks.length) + "%"})) : null,
        tasks.length ? el("span", {class: "frac"}, done + "/" + tasks.length) : null,
        waits ? el("span", {class: "act quiet"}, "after " + (names.findIndex(x => x.toLowerCase() === after.toLowerCase()) + 1))
          : open || (tasks.length && done === tasks.length) ? null
          : el("span", {class: "chip miss", role: "button", tabindex: "0", onclick: add,
              onkeydown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); add(); } }}, "+ Add a next action"));
    })));
  }
  return el("div", {class: "npmpanel"}, ...rows.filter(Boolean));
}
