function computeNudges() {
  const acts = leafActions();
  const n = [];
  // Below this, a newcomer is being told off about a list they have barely started.
  const quiet = gtdQuiet();
  const push = (id, level, label, count, act) => {
    if (count <= 0) return;
    if (quiet && DEEP_NUDGES.includes(id)) return;
    if (nudgeQuiet(id)) return;
    // The same words in both modes: a shorter name was never an easier idea.
    n.push({id, level, label: NUDGE_PLAIN[id] || label, count, act});
  };

  const overdue = acts.filter(a => a.group === "LATE");
  push("late", "danger", "overdue", overdue.length, () => go("today", {jz: "due"}));

  const stuck = stuckActiveProjects();
  push("stuck", "danger", "projects with no next action", stuck.length, () => goReviewSection("stuck"));

  const days = daysToClarify();
  push("days", "warn", "day pages nobody has gone through", days.length, () => go("review", {sub: "days"}));

  const loose = looseActions(acts);
  push("loose", "warn", "journal actions not tied to a project or responsibility", loose.length, () => goReviewSection("loose"));

  const noVerb = acts.filter(a => a.state === "TODO" && a.missingVerb);
  push("verb", "warn", "actions without a physical verb", noVerb.length, () => goReviewSection("verb"));

  const noCtx = acts.filter(a => a.state === "TODO" && a.missingContext);
  push("ctx", "warn", "actions without a context", noCtx.length, () => go("next", {sub: "board"}));

  const oldWait = acts.filter(a => a.state === "WAIT" && (a.age ?? 0) >= CFG.waitFollowUpDays);
  push("wait", "warn", "waiting items to chase", oldWait.length, () => go("waiting"));

  /* Chasing somebody who is not in the space has an answer now, so the nudge
     can point at the thing that actually moves it rather than at a list. */
  const toAsk = updatesWorthAsking();
  push("ask", "warn", "people outside the area to ask for an update", toAsk.length,
       () => toAsk.length === 1 ? openAskForUpdate(toAsk[0].name) : go("waiting"));

  const toTell = stakeholdersDue();
  push("tell", "warn", "people due an update on their responsibilities", toTell.length,
       () => toTell.length === 1 ? openSendUpdate({name: toTell[0].name, org: toTell[0].org}) : go("waiting"));

  const noOutcome = projectsWithoutOutcome();
  push("outcome", "warn", "projects with no stated outcome", noOutcome.length,
       () => noOutcome.length && openOutcomePrompt(noOutcome[0]));

  const orphanProjects = unassignedProjects();
  // The all-areas ladder shows neither of these; the area's own Horizons does.
  push("area", "", "projects under no responsibility", orphanProjects.length, () => openAreaHorizons(Spaces.active));

  const idleGoals = goalsWithoutProjects();
  push("goal", "", "goals with no project", idleGoals.length, () => openAreaHorizons(Spaces.active));

  const stale = weedingWorthIt()
    ? stalestActiveProjects(99).filter(p => (p.ageDays ?? 0) > CFG.staleProjectDays) : [];
  push("stale", "", "projects older than 6 months", stale.length, () => openWeeding());

  /* The one re-ask about storage. The welcome screen offers a folder and the
     getting-started strip offers it again, but both can be walked past -- and a
     list that only exists in one browser is the one loss nothing can undo. So it
     comes back here, once there is enough on the list to be worth keeping, and
     it is as quietenable as any other nudge. */
  const ownWork = acts.filter(a => OPEN_STATES[a.state] && !a.tourStep).length;
  if (CAP.dirPicker && ownWork >= CFG.quietUntilTasks && !nudgeQuiet("nofolder") &&
      V.backend && V.backend.kind !== "fs" && V.backend.kind !== "http") {
    n.push({
      id: "nofolder", level: "warn", label: NUDGE_PLAIN.nofolder,
      count: null, act: () => openSpaceStorageSetup(),
    });
  }

  /* Once a year, in December and January: the templates named for the year
     that is ending, or has just ended, with no copy for the next. */
  const ending = expiringTemplates();
  if (ending.items.length && !nudgeQuiet("tplyear")) n.push({
    id: "tplyear", level: "warn", label: "templates for " + ending.year + " with nothing for " + (ending.year + 1),
    count: ending.items.length, act: () => openTemplateRenewal(),
  });

  if (reviewDue() && !nudgeQuiet("review")) {
    const last = dateIn(getSetting("last_review"));
    const since = daysSinceReview();
    n.push({
      id: "review", level: since > CFG.reviewEveryDays * 2 ? "danger" : "warn",
      label: last ? `weekly review, ${since} days since last`
                  : `first weekly review is due - ${since} days in`,
      count: null, act: () => go("review"),
    });
  }
  if (!n.length) n.push({id: "clean", level: "ok", label: "system is clean - go do the work", count: null, act: null});
  return n;
}
