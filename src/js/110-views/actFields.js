function actFields() {
  const holdSay = iso => "Off your lists until " + humanDate(iso);
  /* Next Monday, and the first of the month after the one next week is in --
     so near the end of a month the second is never sooner than the first. */
  const nextWeek = mondayAfterISO(todayISO()), nw = parseISO(nextWeek);
  const nextMonth = isoOf(new Date(nw.getFullYear(), nw.getMonth() + 1, 1, 12));
  const monthName = parseISO(nextMonth).toLocaleDateString(undefined, {month: "long"});
  const STILL = {keep: "Keep it on your lists", done: "Tick it off", wait: "Say who, and it moves to Waiting for",
    cancel: "Cross it out", note: "Keep the line, as a note", often: "A new repeat::"};
  const homes = r => memo("acthome:" + solKey(r), () => looseTargets(r));
  const add = (r, fn) => actRekey(r, () => inS(r, fn));
  return [
    {k: "still", label: "Still yours to do?", type: "date", dateLabel: "Hold until a day", dateSub: "Off your lists until then",
     /* A stale chore is renegotiated: how often, rather than who or whether it is an action. */
     opts: r => isChore(r)
       ? [["keep", "Still to do"], ["done", "Done already"], ["often", "Change how often"],
         [nextWeek, "Not this week"], [nextMonth, "Not before " + monthName], ["cancel", "Let it go"]]
       : [["keep", "Still to do"], ["done", "Done already"], ["wait", "Waiting on someone"],
         [nextWeek, "Not this week"], [nextMonth, "Not before " + monthName], ["cancel", "Let it go"], ["note", "Not an action"]],
     sub: (r, v) => v === "done" && isChore(r) ? "Tick it off; the next round is put in" : STILL[v] || holdSay(v),
     cur: () => null,
     filled: r => !!actAnsNow(r).still,
     text: r => ({keep: "still to do", done: "done", wait: "waiting", cancel: "let go", note: "a note", hold: "on hold", often: "how often changed"})[actAnsNow(r).still],
     pick: (r, v) => {
       const st = {done: "DONE", cancel: "CANCELLED", note: null};
       if (v === "keep") { solAns(r).still = "keep"; return; }
       if (v === "often") {
         setTimeout(() => openRecurrenceDialog({title: "How often?", spec: repeatOf(r.block), onSave: ({spec}) => {
           inS(r, () => {
             if (spec) setBlockProp(r.block, REPEAT_PROP, spec);
             else for (const key of Object.keys(r.block.props)) if (key.toLowerCase() === REPEAT_PROP) delete r.block.props[key];
             touch(r.path);
           });
           solAns(r).still = "often"; solAfter(r, "still");
         }}), 0);
         return;
       }
       if (v === "wait") {
         // After the box the answer was taken from has closed, as the projects ask it.
         setTimeout(() => solAskWaiting(r, () => {
           if (r.block.state !== "WAIT") { render(); return; }
           solAns(r).still = "wait"; solAfter(r, "still");
         }), 0);
         return;
       }
       solAns(r).still = v in st ? v : "hold";
       holdRender(() => inS(r, () => {
         // A chore ticked off here puts its next round in, as ticked on the Chores page.
         if (v in st) setBlockState(r.path, r.block, st[v], {nextNow: v === "done" && isChore(r)});
         else { setBlockProp(r.block, "hold", "[[" + v + "]]"); touch(r.path); }
       }));
     }},
    {k: "verb", label: "Verb", type: "one", add: "Reword the line", addVal: r => r.block.title,
     opts: () => verbList().filter(v => v.lang === verbLang()).map(v => [v.canonical, capitalise(v.canonical)]),
     /* Its own first word as the verb is offered, but never in the first box:
        taken by reflex, it would teach the lexicon "Quarterly". */
     tail: r => actFirstWord(r) ? [["teach:" + actFirstWord(r), "“" + capitalise(actFirstWord(r)) + "” is the verb"]] : [],
     rank: actVerbRank,
     sub: (r, v) => v.startsWith("teach:") ? "Teach the lexicon the word" : capitalise(v) + " " + plainTitle(r.block.title),
     cur: () => null,
     filled: r => startsWithVerb(r.block.title),
     text: r => capitalise((/^\s*([\p{L}\p{M}\-]+)/u.exec(r.block.title) || [, ""])[1]),
     pick: (r, v) => add(r, () => {
       if (v.startsWith("teach:")) { teachVerb(v.slice(6), verbLang()); touch(r.path); }
       else prependVerb(r.path, r.block, v);
     }),
     make: (r, text) => {
       add(r, () => { r.block.title = trim(text); touch(r.path); });
       if (!startsWithVerb(r.block.title)) notify("It still does not start with a verb the lexicon knows.", "warn");
     }},
    {k: "context", label: "Context", type: "one", scoped: true, add: "New context",
     opts: r => inS(r, () => contextList()).map(c => [c, "@" + c]),
     rank: actCtxRank,
     sub: (r, v) => { const n = leafActions().filter(a => a.context === v && (a.space || V.space) === r.space).length; return n ? n + " open" : ""; },
     cur: () => null,
     filled: r => !!inS(r, () => blockContext(r.block)),
     text: r => "@" + inS(r, () => blockContext(r.block)),
     pick: (r, v) => add(r, () => { r.block.title = trim(r.block.title) + " [[c/" + v + "]]"; touch(r.path); }),
     make: (r, name) => add(r, () => { r.block.title = trim(r.block.title) + " [[c/" + makeContext(name) + "]]"; touch(r.path); })},
    {k: "home", label: "Project or responsibility", type: "one", scoped: true, add: "New project",
     opts: r => homes(r).map(t => [t.path, t.title]),
     sub: (r, v) => (homes(r).find(t => t.path === v) || {}).kind || "",
     cur: () => null,
     filled: r => !!actAnsNow(r).home || !inS(r, () => looseActions([r]).length),
     text: r => inS(r, () => pageTitle(r.path)),
     // Refiled the way the loose actions pass files it, leaving the "Refiled" line on the day.
     // The card follows the line before the redraw on the way past looks for it, or it is taken off the table.
     pick: (r, v) => actRekey(r, () => holdRender(() => { inS(r, () => refileBlock(r.path, r.block, v)); r.path = v; })),
     make: (r, name) => actRekey(r, () => holdRender(() => inS(r, () => {
       const p = createProjectPage(name);
       refileBlock(r.path, r.block, p);
       r.path = p;
     })))},
  ];
}
