function solFields() {
  return [
    {k: "orgs", label: "Organisations", type: "multi", none: "None", scoped: true, add: "New organisation",
     opts: r => pageNames(r, "org"), cur: r => projectOrgs(r), rank: r => solRank(r, "o/", projectOrgs),
     filled: r => projectOrgs(r).length > 0 || saidNone(r, "org") || !!solAns(r).orgs,
     toggle: (r, v) => projectOrgs(r).includes(v) ? removeLinkFromProp(r.space, r.path, "org", "o/" + v)
                                                   : inS(r, () => pageLinkPropAdd(r.path, "org", "o/" + v)),
     clear: r => { for (const o of projectOrgs(r)) removeLinkFromProp(r.space, r.path, "org", "o/" + o); solSayNone(r, "org"); solAns(r).orgs = true; },
     make: (r, name) => { inS(r, () => pageLinkPropAdd(r.path, "org", "o/" + slugify(name))); }},
    /* The people of the project's own area, then those only another area
       knows, as "Kari · Work": one of those is moved, copied or synced into
       this area first, the way you choose, and then put on the project. */
    {k: "people", label: "People", type: "multi", none: "Just me", scoped: true, add: "New person",
     opts: r => {
       const here = inS(r, () => allPeople().map(personName).filter(n => !samePerson(n, whoAmI())));
       const at = n => orgsOnProject(r, n);
       return [...here.map(n => [n, at(n).length ? n + " · " + at(n).join(", ") : n]), ...peopleElsewhere(r.space, here).map(x => [PERSON_AWAY + x.space + PERSON_AWAY + x.name, x.name + " · " + x.space])];
     },
     cur: r => projectPeople(r),
     // Somebody who works at one of the project's organisations is offered first.
     rank: r => { const m = solRank(r, "p/", projectPeople);
       for (const n of inS(r, () => allPeople().map(personName))) if (orgsOnProject(r, n).length)
         m.set(n.toLowerCase(), (m.get(n.toLowerCase()) || 0) + 10000);
       return m; },
     filled: r => projectPeople(r).length > 0 || saidNone(r, "with") || !!solAns(r).people,
     toggle: (r, v) => {
       if (v.startsWith(PERSON_AWAY)) {
         const [, from, name] = v.split(PERSON_AWAY);
         carryPerson(name, r.space, from).then(ok => {
           if (!ok) return;
           inS(r, () => pageLinkPropAdd(r.path, "with", "p/" + name));
           render();
         });
         return;
       }
       return projectPeople(r).includes(v) ? removeLinkFromProp(r.space, r.path, "with", "p/" + v)
                                           : inS(r, () => pageLinkPropAdd(r.path, "with", "p/" + v));
     },
     make: (r, name) => { inS(r, () => pageLinkPropAdd(r.path, "with", "p/" + slugify(name))); },
     clear: r => { for (const n of projectPeople(r)) removeLinkFromProp(r.space, r.path, "with", "p/" + n); solSayNone(r, "with"); solAns(r).people = true; }},
    {k: "area", label: "Responsibility", type: "one", scoped: true, add: "New responsibility",
     opts: r => inS(r, () => areaList().map(p => [baseName(p), pageTitle(p)])),
     rank: r => solRank(r, "a/", p => { const a = inS(r, () => areaOfProject(p.path)); return a ? [a] : []; }),
     cur: r => inS(r, () => areaOfProject(r.path)),
     filled: r => !!inS(r, () => areaOfProject(r.path)),
     pick: (r, v) => inS(r, () => setAreaOfProject(r.path, v)),
     make: (r, name) => inS(r, () => setAreaOfProject(r.path, baseName(createArea(name))))},
    {k: "next", label: "Next action", type: "text", ph: "Add the very next thing to do",
     val: r => { const a = projectActions(r).find(x => OPEN_STATES[x.state]);
       return a ? plainTitle(a.title) + (a.assignee && !a.mine ? " (waiting on " + firstNameOf(a.assignee) + ")" : "") : ""; },
     filled: r => projectActions(r).some(a => OPEN_STATES[a.state]),
     submit: (r, text) => inS(r, () => addNextActionTo(r.path, linkKnownNames(text)))},
    {k: "outcome", label: "Done when", type: "text", ph: "What does done look like?",
     val: r => inS(r, () => outcomeOf(r.path)) || "", filled: r => !!inS(r, () => outcomeOf(r.path)),
     submit: (r, text) => inS(r, () => setOutcome(r.path, text))},
    {k: "deadline", label: "Deadline", type: "date",
     opts: () => [...SOL_ENDS.map(([k, label]) => [solEndOf(k), label]), ["none", "No deadline"]],
     cur: r => dateIn(pageProp(r.space, r.path, "deadline")) || (saidNone(r, "deadline") || solAns(r).deadline ? "none" : null),
     val: r => { const d = dateIn(pageProp(r.space, r.path, "deadline")); return d ? humanDate(d) : saidNone(r, "deadline") || solAns(r).deadline ? "No deadline" : ""; },
     filled: r => !!dateIn(pageProp(r.space, r.path, "deadline")) || saidNone(r, "deadline") || !!solAns(r).deadline,
     pick: (r, v) => {
       inS(r, () => {
         const page = getPage(r.path);
         // Written, so next week's review does not ask again (#377).
         if (v === "none") { page.props.deadline = NOTHING_FIRST; solAns(r).deadline = true; }
         else page.props.deadline = "[[" + v + "]]";
         touch(r.path);
       });
     }},
    {k: "after", label: "Comes after", type: "one", scoped: true,
     opts: r => [["none", "Nothing comes first"], ...inS(r, () => [...projectsIn("1"), ...projectsIn("3")]
       .filter(p => p !== r.path && !wouldCycle(r.path, p)).map(p => [p, pageTitle(p)]))],
     cur: r => inS(r, () => dependsOn(r.path)[0] || (chainAnswered(r.path) ? "none" : null)), rank: solKin,
     filled: r => inS(r, () => chainAnswered(r.path)),
     pick: (r, v) => inS(r, () => writeDependsOn(r.path, v === "none" ? [] : [v]))},
    {k: "status", label: "Still the right status?", type: "one",
     opts: () => [...STATUS_CHIPS.map(c => [c, STATUS_LABEL[c]]), ["hold", "On hold until a day"]],
     cur: r => solAns(r).status ? (solHeld(r) ? "hold" : inS(r, () => statusDirOf(r.path))) : null,
     now: r => inS(r, () => statusDirOf(r.path)),
     filled: r => !!solAns(r).status,
     pick: (r, v) => {
       const was = solKey(r), ans = solAns(r);
       // Still committed to, so it keeps its shelf and is asked for the day.
       if (v === "hold") { ans.status = true; setTimeout(() => inS(r, () => openProjectHold(r.path)), 0); return; }
       /* The move redraws on its way past. Held until the card has followed
          the page to its new folder, answers and all, or that redraw finds
          the old path gone and takes the project off the table mid-review. */
       holdRender(() => {
         if (inS(r, () => statusDirOf(r.path)) !== v) {
           inS(r, () => setProjectStatus(r.path, v, {ask: false}));
           const moved = join(STATUS_DIRS[v], baseName(r.path) + ".md");
           if (inS(r, () => V.pages.has(moved))) r.path = moved;
         }
         SOL_ANS.delete(was); SOL_ANS.set(solKey(r), Object.assign(ans, {status: true}));
       });
       // In the review the card asks who itself, before the hand is gathered up.
       if (v === "3" && SOL_EDIT) setTimeout(() => solAskWaiting(r), 0);   // after the chooser has closed
     }},
  ];
}
