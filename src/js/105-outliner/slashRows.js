function slashRows(q) {
  const f = q.toLowerCase();
  const hit = c => !f || c.kw.some(w => w.startsWith(f)) || c.title.toLowerCase().startsWith(f);
  const stages = typeChoices().flatMap(t => { const name = typeTitle(t); return typeStages(t).map(st => ({t, name, st,
    kw: [...st.name.toLowerCase().split(/\s+/), ...name.toLowerCase().split(/\s+/)]})); });
  return [...SLASH_COMMANDS.filter(hit).map(c => ({accept: "command", id: c.id, title: c.title,
    detail: c.detail, mark: "/"})),
    ...stages.filter(s => !f || s.kw.some(w => w.startsWith(f))).map(s => ({accept: "command",
      id: STAGE_CMD + (s.t.space || "") + "\u0001" + s.t.path + "\u0001" + s.st.name, title: s.st.name,
      detail: s.name + " · " + CORE_WORD[s.st.core], mark: "/"}))];
}
