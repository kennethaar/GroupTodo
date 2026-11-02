/* What the review page lists, each under the part of the review it is done
   in (phase), in David Allen's order: the journal's loose actions are the
   inbox (get clear); the action lists, the birthdays beside the calendar,
   waiting for and then the projects (get current); someday/maybe (get
   creative). An action list is kind: "actions", so the weeks go after them. */
function reviewSections() {
  const acts = leafActions();
  return [
    {phase: "clear", id: "loose", title: "Journal actions without a project or responsibility", hint: "refile or let them go",
     items: looseActions(acts).map(a => ({text: a.title, sub: a.path, path: a.path, block: a.block,
       fix: "refile", act: () => { closeModal(); openRefile(a.path, a.block); }}))},
    {phase: "current", kind: "actions", id: "verb", title: "Actions without a physical verb", hint: "what would a camera see?",
     items: acts.filter(a => a.state === "TODO" && a.missingVerb).map(a => ({text: a.title, sub: a.path, path: a.path, block: a.block,
       fix: "add verb", act: () => { closeModal(); openVerbPicker(a.path, a.block); }}))},
    {phase: "current", kind: "actions", title: "Actions without a context", hint: "where can this be done?",
     items: acts.filter(a => a.state === "TODO" && a.missingContext).map(a => ({text: a.title, sub: a.path, path: a.path, block: a.block,
       fix: "add context", act: () => { closeModal(); promptAndInsertContext(a.path, a.block); }}))},
    {phase: "current", id: "birthdays", title: "Birthdays coming up", hint: "the next two weeks - a card, a call, a present?",
     items: upcomingBirthdays(14).map(x => ({text: x.name, sub: birthdayWhen(x), path: x.path, space: x.space,
       fix: "open", act: () => { closeModal(); openPageIn(x.space, x.path); }}))},
    {phase: "current", title: "Waiting for", hint: "chase anything older than " + CFG.waitFollowUpDays + " days",
     items: acts.filter(a => a.state === "WAIT").map(a => ({text: a.title, sub: (a.age != null ? a.age + "d" : "") + " · " + a.path,
       path: a.path, block: a.block, fix: "open", act: () => { closeModal(); openTaskDetail(a.path, a.block); }}))},
    {phase: "current", id: "stuck", title: "Stuck active projects", hint: "no next action - define one or park it",
     items: stuckActiveProjects().map(s => ({text: pageTitle(s.path), sub: s.reason, path: s.path,
       fix: "+ next action", act: () => { closeModal(); openAddNextAction(s.path); }}))},
    {phase: "current", title: "Projects not stated as an outcome", hint: "what would done look like?",
     items: projectsWithoutOutcome().map(p => ({text: pageTitle(p), sub: "no outcome:: yet", path: p,
       fix: "state outcome", act: () => { closeModal(); openOutcomePrompt(p); }}))},
    {phase: "current", title: "Active projects not reviewed lately", hint: "touch them or move them",
     items: projectsIn("1").map(p => {
        const r = dateIn(getPage(p).props?.reviewed);
        const d = r ? dateDiffDays(r, todayISO()) : null;
        return {p, d, r};
      }).filter(x => x.d == null || x.d >= CFG.reviewEveryDays)
        .sort((a, b) => (b.d ?? 9999) - (a.d ?? 9999))
        .map(x => ({text: pageTitle(x.p), sub: x.r ? "reviewed " + x.d + "d ago" : "never reviewed", path: x.p,
          fix: "mark reviewed", act: () => { updateReviewed(x.p); render(); }}))},
    {phase: "creative", title: "Someday / maybe", hint: "anything ready to become active?",
     items: projectsIn("2").map(p => ({text: pageTitle(p), sub: openTodoCount(p) + " actions", path: p,
       fix: "activate", act: () => { setProjectStatus(p, "1"); render(); }}))},
  ];
}
