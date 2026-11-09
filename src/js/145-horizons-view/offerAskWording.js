/* After the note has gone: each reworded line, what the task says and what it
   would say, ticked; nothing is written until you press Update. then() is
   what comes after, the next note when there are two. */
function offerAskWording(name, items, lines, edited, then = null) {
  const changes = [];
  edited.forEach((it, i) => {
    const a = lines[i];
    if (!it.edit || !a) return;
    // A task with its own question (#344) takes the reworded question there,
    // and keeps its title.
    if (it.q && trim(it.ask || "")) {
      const t = trim(it.edit.t || "");
      if (t && t !== trim(it.ask)) changes.push({a, was: it.ask, next: t, prop: ASK_Q_PROP, take: true});
      return;
    }
    const next = inSpace(a.space, () => askTitleFrom(a.block.title, it, name));
    if (next && trim(next) !== trim(a.block.title)) changes.push({a, was: a.block.title, next, take: true});
  });
  if (!changes.length) return;
  const done = () => { closeModal(); if (then) then(); };
  const go = el("button", {class: "btn primary", onclick: () => {
    const take = changes.filter(c => c.take);
    if (!take.length) { done(); return; }
    const snaps = [];
    for (const c of take)
      if (!snaps.some(x => x.space === c.a.space && x.path === c.a.path))
        snaps.push({space: c.a.space, path: c.a.path, page: inSpace(c.a.space, () => structuredClone(getPage(c.a.path)))});
    for (const c of take) inSpace(c.a.space, () => {
      if (c.prop) setBlockProp(c.a.block, c.prop, c.next); else c.a.block.title = c.next;
      touch(c.a.path);
    });
    const back = () => {
      for (const x of snaps) inSpace(x.space, () => {
        const p = getPage(x.path);
        if (p) { Object.assign(p, structuredClone(x.page)); touch(x.path); }
      });
      noteTodoTouched();
      render();
      return true;
    };
    pushUndo({run: back});
    noteTodoTouched();
    notify(take.length === 1 ? "The task now says what the note said." : take.length + " tasks now say what the note said.",
      "info", {label: "Undo", run: back});
    render();
    done();
  }});
  const label = () => { const n = changes.filter(c => c.take).length; go.textContent = n ? "Update " + n : "Update none"; };
  const list = el("div", {style: "max-height:46vh;overflow:auto"},
    ...changes.map(c => {
      const box = el("button", {class: "spacetoggle on", onclick: () => {
        c.take = !c.take;
        box.className = "spacetoggle" + (c.take ? " on" : "");
        box.replaceChildren(...(c.take ? [svgIcon(ICON_CHECK)] : []));
        label();
      }}, svgIcon(ICON_CHECK));
      return el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:9px 0"},
        box,
        el("div", {style: "min-width:0;flex:1"},
          el("div", {style: "color:var(--fg3);font-size:12.5px;text-decoration:line-through"},
            inSpace(c.a.space, () => plainTitle(c.was))),
          el("div", {}, inSpace(c.a.space, () => plainTitle(c.next))),
          el("div", {style: "color:var(--fg3);font-size:12px;margin-top:2px"}, c.a.path)));
    }));
  label();
  modal({
    center: true, title: "Use your wording in the tasks?",
    hint: changes.length + (changes.length === 1 ? " line" : " lines") + " reworded",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "You changed these in the note to " + name),
        list),
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Only the task's words change. What it is about stays its project, and its links, tags and " +
          "who it is asked of stay with it. The lines under a task are not changed."))),
    foot: [
      el("button", {class: "btn ghost", onclick: done}, "Keep the tasks as they are"),
      go,
    ],
  });
}
