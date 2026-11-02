/* What was said is kept where the task is: informed:: on the line, "Told ..."
   in its thread. A status you changed in the dialog goes to the task once you
   say so. Undo takes all of it back. */
function informSent(name, chosen, items, to = {name}) {
  const snaps = [];
  const keep = (space, path) => {
    if (!snaps.some(s => s.space === space && s.path === path))
      snaps.push({space, path, page: inSpace(space, () => structuredClone(getPage(path)))});
  };
  for (const r of chosen) if (r.kind === "proj") keep(r.area.space, r.area.path); else keep(r.a.space, r.a.path);
  const back = () => {
    for (const s of snaps) inSpace(s.space, () => {
      const p = getPage(s.path);
      if (p) { Object.assign(p, structuredClone(s.page)); touch(s.path); }
    });
    noteTodoTouched();
    render();
    return true;
  };
  const stamp = nowStamp(), en = INFORM_NOTE.en;
  const said = it => trim(String(it.comment || "").replace(/\s+/g, " "));
  chosen.forEach((r, i) => {
    if (r.kind === "proj") return;
    inSpace(r.a.space, () => {
      const it = items[i];
      setBlockProp(r.a.block, INFORMED_PROP, name + " " + stamp);
      const word = informStatusWord(it.status, Object.fromEntries(INFORM_STATES));
      postMessage(r.a.path, r.a.block, "Told " + name + ": " + [word, said(it)].filter(Boolean).join(". "));
      touch(r.a.path);
    });
  });
  // One line per responsibility on its page, naming what was told, and the stamp the next "since" counts from.
  const areas = [...new Set(chosen.filter(r => r.kind === "proj").map(r => r.area))];
  for (const area of areas) inSpace(area.space, () => {
    const parts = chosen.map((r, i) => [r, items[i]]).filter(([r]) => r.area === area)
      .map(([r, it]) => it.t + " (" + (en.projects[r.p.code] || "") + ")" + (said(it) ? ": " + said(it) : ""));
    setToldOn(area.path, to, stamp);
    logTold(area.path, to, parts.join("; "));
  });
  pushUndo({run: back});
  noteTodoTouched();
  render();
  notify(chosen.length === 1 ? "Marked as told to " + name + "." : chosen.length + " lines marked as told to " + name + ".",
    "info", {label: "Undo", run: back});
  const changes = chosen.filter(r => r.kind !== "proj").map(r => ({r, to: items[chosen.indexOf(r)].status}))
    .filter(x => x.to && x.to !== x.r.was);
  if (changes.length) offerInformStatus(changes);
}
