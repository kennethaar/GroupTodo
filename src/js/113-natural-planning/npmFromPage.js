function npmFromPage(space, path) {
  const page = getPage(path) || {props: {}, blocks: []};
  const d = {space, path, step: 0, q: 0, purpose: [], onpurpose: [], principles: [], vision: [], know: [],
    outcome: outcomeOf(path) || "", people: projectPeople({space, path}), peopleDone: false,
    ideas: [], comps: [], ordered: false, free: {}, deck: 0, hideDeck: false, last: [], naming: false, ai: false};
  const known = new Set();
  const idea = (t, to) => { known.add(t.toLowerCase()); d.ideas.push({id: uid(), t, to}); };
  for (const b of page.blocks || []) {
    const k = npmHeadOf(b);
    if (!k) continue;
    const kids = b.children || [];
    if (k === "purpose" || k === "outcome") for (const c of kids) {
      const t = trim(c.title);
      if (k === "purpose" && /^principles:?$/i.test(t)) { d.principles.push(...(c.children || []).map(x => trim(x.title)).filter(Boolean)); continue; }
      const hit = NPM_LINES.find(([, w]) => t.toLowerCase().startsWith(w.toLowerCase() + ":"));
      if (hit) { const v = trim(t.slice(hit[1].length + 1)); if (v) d[hit[0]].push(v); }
      else if (t && k === "purpose") d.purpose.push(t);
      else if (t) d.vision.push(t);
    }
    else if (k === "comps") for (const c of kids) {
      const m = /^###\s+(.+)$/.exec(trim(c.title));
      if (!m) continue;
      const comp = {id: uid(), name: npmNum(m[1]), after: npmNum(c.props?.after) || null, keep: [], act: {}};
      d.comps.push(comp);
      // A plain line is an idea; a task, or anything with more to it, is kept as it is.
      for (const x of c.children || []) {
        if (!x.state && !(x.children || []).length && !Object.keys(x.props || {}).length && trim(x.title)) idea(trim(x.title), "c:" + comp.id);
        else comp.keep.push(serializeBlockLines([x]).join("\n"));
      }
    }
    else if (k !== "brainstorm") for (const c of kids) if (trim(c.title)) idea(trim(c.title), k);
  }
  // The brainstorm is every idea as it was typed: what is not placed anywhere else was not needed.
  const raw = (page.blocks || []).find(b => npmHeadOf(b) === "brainstorm");
  for (const c of raw?.children || []) { const t = trim(c.title); if (t && !known.has(t.toLowerCase())) idea(t, "trash"); }
  for (const c of d.comps) if (c.after) {
    const a = d.comps.find(x => x !== c && x.name.toLowerCase() === c.after.toLowerCase());
    c.after = a ? a.id : null;
  }
  d.ordered = d.comps.length > 1;
  d.peopleDone = d.people.length > 0;
  return d;
}
