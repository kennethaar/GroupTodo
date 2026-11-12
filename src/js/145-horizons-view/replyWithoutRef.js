/* A reply with no reference in it (#373): a forwarded mail, a chat line, what
   they said on the phone. You say who it is from, then which of their open
   things it answers -- what they owe you, what you asked them, and the
   projects those are in. When it is none of those, Search everything finds
   any open task. It is then filed and reviewed like any other reply. */
function replyWithoutRef(text) {
  const note = trim(text);
  const said = "“" + (note.length > 80 ? note.slice(0, 79) + "…" : note) + "”";
  const hitOf = a => ({space: a.space || null, path: a.path, block: a.block});
  const file = (a, who) => openUpdateArrived({from: who, who, items: [{hit: hitOf(a), note, done: false}]});
  const titleOf = a => inSpace(a.space, () => plainTitle(a.block.title));
  const projectOf = a => a.projectPath ? inSpace(a.space, () => V.pages.has(a.projectPath) ? pageTitle(a.projectPath) : baseName(a.projectPath)) : "";
  const open = () => leafActions().filter(a => OPEN_STATES[a.state]);
  const theirs = name => {
    const waits = waitingOnFrom(name);
    return waits.concat(askingAbout(name).filter(a => !waits.some(w => w.block === a.block)));
  };
  // Every step has Back, to the step before with nothing filed (P17).
  const backTo = run => el("button", {class: "btn ghost", onclick: () => { closeModal(); run(); }}, "◂ Back");
  const searchAll = (who, back) => listPicker({
    title: "Which task is it about?", hint: said, items: open(), typeahead: true, start: -1,
    label: titleOf, detail: projectOf, search: a => titleOf(a) + " " + projectOf(a),
    onPick: a => file(a, who), footer: backTo(back),
  });
  const everything = (who, back) => el("button", {class: "btn ghost", onclick: () => { closeModal(); searchAll(who, back); }}, "Search everything");
  // A project picked: which of its open lines the reply goes on.
  const inProject = (p, who) => {
    const back = () => aboutWhat(who);
    const lines = open().filter(a => a.projectPath === p.path && (a.space || null) === (p.space || null));
    if (!lines.length) { notify("Nothing open in " + p.title + " to put it on. Search for the task instead.", "warn"); searchAll(who, back); return; }
    listPicker({title: "Which line in " + p.title + "?", hint: said, items: lines, label: titleOf,
      onPick: a => file(a, who), footer: [backTo(back), el("div", {style: "flex:1"}), everything(who, back)]});
  };
  const aboutWhat = who => {
    const back = () => fromWhom();
    const tasks = theirs(who);
    const projects = [];
    for (const a of tasks) {
      const title = projectOf(a);
      if (title && !projects.some(p => p.path === a.projectPath && p.space === (a.space || null)))
        projects.push({isProject: true, path: a.projectPath, space: a.space || null, title});
    }
    const items = [...tasks, ...projects];
    if (!items.length) { searchAll(who, back); return; }
    listPicker({
      title: "Which is it about?", hint: who + " · " + said, items,
      label: x => x.isProject ? x.title : titleOf(x),
      detail: x => x.isProject ? "Project" : (x.mention ? "Your question" : "Waiting for") + (projectOf(x) ? " · " + projectOf(x) : ""),
      onPick: x => x.isProject ? inProject(x, who) : file(x, who),
      footer: [backTo(back), el("div", {style: "flex:1"}), everything(who, () => aboutWhat(who))],
    });
  };
  // Whoever has most open with you first: the reply is most likely theirs.
  const counts = new Map();
  const people = peopleRows().filter(r => !r.me)
    .map(r => { counts.set(r.name, theirs(r.name).length); return r; })
    .sort((x, y) => counts.get(y.name) - counts.get(x.name) || x.name.localeCompare(y.name));
  // Back from the first step is the pasted text, still there to change.
  const fromWhom = () => listPicker({
    title: "Who is it from?", hint: said, items: people, typeahead: true, start: -1,
    label: r => r.name, detail: r => counts.get(r.name) ? counts.get(r.name) + " open" : "",
    search: r => [r.name, ...(r.aliases || [])].join(" "),
    onPick: r => aboutWhat(r.name),
    footer: [backTo(() => importUpdatePasted(text)), el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); searchAll("", fromWhom); }}, "Not sure: search everything")],
  });
  fromWhom();
}
