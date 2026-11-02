/* One project as one card, in Planner's terms. Run inside the project's area. */
function plannerCard(r) {
  const props = getPage(r.path)?.props || {};
  const code = effStatus(r);
  const progress = PLANNER_PROGRESS[code] || "notStarted";
  const steps = plannerSteps(r);
  const open = steps.filter(s => OPEN_STATES[s.state]).sort(byUrgency);
  const since = shiftISO(todayISO(), -PLANNER_RECENT_DAYS);
  const done = steps.filter(s => s.state === "DONE" && (closedOn(s.block) || "") >= since)
    .sort((x, y) => (closedOn(y.block) || "").localeCompare(closedOn(x.block) || ""));

  const checklist = [], seen = new Set();
  for (const [s, isChecked] of [...open.map(s => [s, false]), ...done.map(s => [s, true])]) {
    if (checklist.length >= PLANNER_CHECKLIST_MAX) break;
    const title = plannerText(s.block.title, 100);
    const id = plannerGuid(blockProp(s.block, "id") || title);
    if (!title || seen.has(id)) continue;
    seen.add(id);
    checklist.push({id, title, isChecked});
  }

  const people = plannerPeople(r);
  const notes = [];
  if (code === "-") notes.push("Cancelled.");
  const outcome = trim(String(props.outcome || ""));
  if (outcome) notes.push("Outcome: " + plannerText(outcome, 500));
  notes.push("Status: " + (PLANNER_STATUS_WORDS[code] || code));
  const waits = open.filter(s => s.state === "WAIT");
  if (waits.length) {
    notes.push("", "Waiting for:");
    for (const s of waits.slice(0, 10)) {
      const who = assigneeOf(s.block);
      notes.push("- " + plannerText(s.block.title, 200) + (who ? " \u2014 " + plannerPerson(who) : ""));
    }
  }
  if (done.length) {
    notes.push("", "Done lately:");
    for (const s of done.slice(0, 10)) {
      const who = closedBy(s.block);
      notes.push("- " + closedOn(s.block) + " " + plannerText(s.block.title, 200) + (who ? " \u2014 " + plannerPerson(who) : ""));
    }
  }
  if (people.missing.length) notes.push("", "Not assigned, no email:: on their page: " + people.missing.map(plannerPerson).join("; "));
  notes.push("", "In GroupToDo: " + r.path + (r.space ? " (" + r.space + ")" : ""));

  const {start, due} = plannerDates(r.path);
  return {key: r.path, id: trim(String(props[PLANNER_ID_PROP] || "")) || null,
    title: plannerText(pageTitle(r.path), 255), bucket: plannerBucket(r),
    progress, percentComplete: PLANNER_PERCENT[progress], start, due,
    assignees: people.emails, notes: notes.join("\n").slice(0, 8000), checklist, missing: people.missing};
}
