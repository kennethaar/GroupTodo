/* ---------- writing the page ---------- */
function npmWrite() {
  if (npmLocked()) return;
  npmCommit();
  const d = NPM, {space, path} = d;
  let before = null;
  inSpace(space, () => {
    const page = getPage(path);
    if (!page) return;
    before = clonePage(page);
    const line = (t, kids = []) => newBlock({title: t, children: kids}, false);
    const head = (k, kids, collapsed = false) => newBlock({title: "## " + NPM_HEADS[k], children: kids, collapsed}, false);
    const said = keys => NPM_LINES.filter(([k]) => keys.includes(k)).flatMap(([k, w]) => d[k].map(v => line(w + ": " + v)));
    const action = a => {
      let t = trim(a && a.text || "");
      if (!t) return null;
      if (a.ctx && !hasContextLink(t)) t += " [[c/" + a.ctx + "]]";
      const b = stampAuthor(newBlock({state: a.who ? "WAIT" : "TODO", title: t, props: {}}));
      // Somebody else's step is never a TODO of yours: it waits on them.
      if (a.who) b.props.assigned = a.who;
      createLinkedPages(b.title);
      return b;
    };
    const ideas = to => d.ideas.filter(i => i.to === to).map(i => line(i.t));
    const num = c => (d.comps.indexOf(c) + 1) + ". " + c.name;
    const out = [];
    const why = [...said(["purpose", "onpurpose"]), ...(d.principles.length ? [line("Principles", d.principles.map(p => line(p)))] : [])];
    if (why.length) out.push(head("purpose", why));
    if (d.vision.length || d.know.length) out.push(head("outcome", said(["vision", "know"])));
    if (d.comps.length) out.push(head("comps", d.comps.map(c => {
      const h = newBlock({title: "### " + num(c), children: [...ideas("c:" + c.id),
        ...(c.keep || []).flatMap(t => parsePage(t).blocks), action(c.act)].filter(Boolean)}, false);
      const a = c.after && npmComp(c.after);
      if (a) h.props.after = num(a);
      return h;
    })));
    const direct = [...d.ideas.filter(i => i.to === "next").map(i => action(i.act && trim(i.act.text || "") ? i.act : {text: i.t})),
      action(d.free)].filter(Boolean);
    for (const k of ["support", "later"]) { const kids = ideas(k); if (kids.length) out.push(head(k, kids, true)); }
    if (d.ideas.length) out.push(head("brainstorm", d.ideas.map(i => line(i.t)), true));
    page.blocks = [...out, ...direct, ...(page.blocks || []).filter(b => !npmHeadOf(b)
      && !(/^outcome:/i.test(trim(b.title)) && OUTCOME_PLACEHOLDER.test(b.title)))];
    if (trim(d.outcome)) page.props.outcome = trim(d.outcome);
    if (d.purpose.length) page.props.purpose = d.purpose.join("; ");
    if (d.people.length) { page.props.with = d.people.map(n => "[[p/" + n + "]]").join(", "); createLinkedPages(page.props.with); }
    else if (d.peopleDone) delete page.props.with;
    page.props.planned = todayISO();
    touch(path);
  });
  if (!before) { notify("That project is gone.", "warn"); return; }
  npmForget(space, path);
  NPM_QUEUE = NPM_QUEUE.filter(x => !(x.space === space && x.path === path));
  const restore = () => {
    let ok = false;
    inSpace(space, () => { if (!V.pages.has(path)) return; putPage(path, clonePage(before)); touch(path); ok = true; });
    if (ok) { render(); notify("The plan is taken back off the page."); }
    return ok;
  };
  pushUndo({run: restore, label: "Plan written"});
  NPM = null; state.planPath = null;
  openPageIn(space, path);
  const next = NPM_QUEUE[0];
  notify("Plan written to “" + inSpace(space, () => pageTitle(path)) + "”.", "info",
    next ? {label: "Plan " + inSpace(next.space, () => pageTitle(next.path)) + " next", run: () => npmOpen(next.space, next.path)}
         : {label: "Undo", run: restore});
}
