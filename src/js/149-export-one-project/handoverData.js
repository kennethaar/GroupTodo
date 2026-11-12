/* A project as somebody outside GroupToDo reads it: facts, what is open, what
   is done, and one history, oldest first. Plain words only, no key:: value or
   [[links]]. `strip` drops every name of who did what. */
function handoverData(path, {includeRefs = false, strip = false} = {}) {
  const page = getPage(path), today = todayISO();
  const who = s => strip ? "" : trim(s || "");
  const words = s => plainTitle(s);
  // key:: none is the weekly review's "nobody", not a name (#377).
  const prop = k => { const v = String(page.props?.[k] ?? ""); return trim(v).toLowerCase() === NOTHING_FIRST ? "" : linkWords(v); };
  const hold = projectHold(path);
  const status = hold ? "On hold until " + hold : (STATUS_LABEL[effStatus({space: V.space, path})] || "");

  const open = [], done = [], history = [];
  const walk = (blocks, depth) => {
    for (const b of blocks || []) {
      if (b.state === "DONE") {
        const date = closedOn(b) || "";
        done.push({text: words(b.title), date, who: who(closedBy(b))});
        history.push({date, what: "Done: " + words(b.title), who: who(closedBy(b))});
      } else if (OPEN_STATES[b.state]) {
        const due = dueDate(b) || "";
        open.push({depth, text: words(b.title), state: b.state, due, late: !!due && due < today,
          context: blockContext(b) || "", assigned: linkWords(blockProp(b, "assigned") || ""),
          leaf: !hasOpenDescendant(b)});
      }
      for (const m of messagesOf(b)) history.push({date: (msgAt(m).match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "",
        what: "Chat on '" + words(b.title) + "': " + words(m.title), who: who(msgAuthor(m))});
      walk((b.children || []).filter(c => !isMessage(c)), depth + 1);
    }
  };
  walk(page.blocks, 0);

  // Only the line that links here, and what is under it; never the rest of the day page.
  for (const h of backlinksTo(path)) {
    if (!h.trail || !isJournalPath(h.path)) continue;
    const under = [];
    walkBlocks(h.block.children, c => { if (!isMessage(c)) under.push(words(c.title)); });
    history.push({date: baseName(h.path), what: "Day page: " + [words(h.block.title), ...under].filter(Boolean).join(" / "), who: ""});
  }
  const created = dateIn(page.props?.created);
  if (created) history.push({date: created, what: "Project created", who: who(page.props?.by)});
  history.sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));

  const notes = [];
  const note = (blocks, depth) => {
    for (const b of blocks || []) {
      if (b.state || isMessage(b)) continue;
      notes.push({depth, text: words(b.title)});
      note(b.children, depth + 1);
    }
  };
  note(page.blocks, 0);
  if (includeRefs) for (const p of collectExport(path, {includeRefs: true}).slice(1)) {
    notes.push({depth: 0, text: pageTitle(p), head: true});
    note(getPage(p).blocks, 1);
  }
  const t = projectTally({space: V.space, path});
  const money = [fmtPrices(t.spent) && "Spent " + fmtPrices(t.spent), fmtPrices(t.planned) && "Planned " + fmtPrices(t.planned)].filter(Boolean);

  const facts = [["Outcome", prop("outcome")], ["Status", status], ["Client", prop("org")], ["With", prop("with")],
    ["Responsible", prop("responsible")], ["Starts", dateIn(page.props?.scheduled) || ""],
    ["Deadline", dateIn(page.props?.deadline) || dateIn(page.props?.due) || ""]].filter(f => f[1]);
  const firstLeaf = open.find(o => o.leaf && o.state !== "WAIT");
  const stands = [
    ...(firstLeaf ? [{label: "Next", ...firstLeaf}] : []),
    ...open.filter(o => o.state === "WAIT").map(o => ({label: "Waiting", ...o})),
    ...open.filter(o => o.late).map(o => ({label: "Late", ...o})),
  ];
  return {title: pageTitle(path), facts, stands, open, done, history, notes, money, when: today, by: who(whoAmI())};
}
