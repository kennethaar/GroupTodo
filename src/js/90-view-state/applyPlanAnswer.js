/* Onto the project the lines are already in, the one the AI named, or a new
   one. The lines it came from stay where they are, with a link to it. */
function applyPlanAnswer(src, raw) {
  const plan = parsePlanAnswer(raw);
  if (!plan.actions.length) {
    notify("No next action in that. Paste the AI's whole answer: the project name and a TODO or WAIT line.", "warn");
    return false;
  }
  if (!src.project && !plan.name) { notify("No project name in that: it is the first line of the answer.", "warn"); return false; }
  const space = src.space;
  let target = null, made = false;
  const before = new Map();
  const keep = p => { if (p && !before.has(p) && getPage(p)) before.set(p, structuredClone(getPage(p))); };
  let created = [];
  inSpace(space, () => {
    const fields = plan.fields.map(f => ({...f, value: planFixLine(f.value, false)}));
    for (const a of plan.actions) a.title = planFixLine(a.title, true);
    target = src.project && getPage(src.project.path) ? src.project.path : planFindProject(plan.name);
    if (target) {
      keep(target);
      for (const a of plan.actions) getPage(target).blocks.push(planActionBlock(a));
    } else {
      const loose = plan.actions.filter(a => !fields.some(f => f.actions.includes(a)));
      const blocks = fields.map(f => {
        const b = newBlock({title: trim(f.label + " " + f.value)}, false);
        b.children = f.actions.map(planActionBlock);
        return b;
      }).concat(loose.map(planActionBlock));
      target = createProjectPage(plan.name, blocks);
      made = true;
    }
    const page = getPage(target);
    const vision = fields.find(f => f.key === "vision");
    if (vision && vision.value && !trim(page.props.outcome || "")) page.props.outcome = vision.value;
    const stake = fields.filter(f => f.key === "stakeholders").map(f => f.value).join(" ");
    for (const [prop, pfx] of [["with", "p/"], ["org", "o/"]]) {
      const have = linksIn(String(page.props[prop] || "")).map(l => trim(l.split("][")[0]).toLowerCase());
      const add = linksIn(stake).map(l => trim(l.split("][")[0]))
        .filter(l => l.startsWith(pfx) && !have.includes(l.toLowerCase()) && !(pfx === "p/" && samePerson(l.slice(2), whoAmI())));
      if (add.length) page.props[prop] = [trim(page.props[prop] || ""), ...add.map(l => "[[" + l + "]]")].filter(Boolean).join(", ");
    }
    touch(target);
    created = createLinkedPages(serializePage(page));
    // The lines it came from keep their place, and point at the project.
    const ref = "[[" + pageRef(target) + "]]";
    const links = b => linksIn(b.title).some(l => findExistingPage(trim(l.split("][")[0])) === target);
    const from = getPage(src.path);
    if (from && src.path !== target) {
      if (src.kind === "email") {
        if (!from.blocks.some(links)) { keep(src.path); from.blocks.push(newBlock({title: "Planned as " + ref}, false)); touch(src.path); }
      } else {
        let first = null;
        walkBlocks(from.blocks, b => { if (b.id === src.ids[0]) first = b; });
        if (first && !links(first)) { keep(src.path); first.title = trim(first.title + " " + ref); touch(src.path); }
      }
    }
    noteTodoTouched();
  });
  pushUndo({run: () => inSpace(space, () => {
    for (const [p, snap] of before) { const pg = getPage(p); if (pg) { Object.assign(pg, structuredClone(snap)); touch(p); } }
    for (const p of [...created, ...(made ? [target] : [])]) if (getPage(p)) removePage(p);
    render();
    notify("Put back as it was.");
    return true;
  })});
  render();
  const title = inSpace(space, () => pageTitle(target));
  notify((made ? "Made the project “" + title + "”" : "Added to “" + title + "”") +
    (plan.actions.length === 1 ? " with its next action." : " with " + plan.actions.length + " actions.") + " Ctrl+Z takes it back.",
    "info", {label: "Open", run: () => openPageIn(space, target)});
  if (statusDirOf(target) === "0")
    notify("“" + title + "” was completed.", "warn", {label: "Reopen it", run: () => inSpace(space, () => setProjectStatus(target, "1"))});
  return true;
}
