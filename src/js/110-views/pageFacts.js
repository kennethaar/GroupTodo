function pageFacts(path) {
  const page = getPage(path) || {props: {}};
  const props = page.props || {};
  const horizon = isHorizonPage(path);
  const code = horizon ? null : statusDirOf(path);
  const facts = [];
  if (horizon) facts.push(horizonFact(path));
  if (code) {
    facts.push(statusFact(path, code));
    if (code === "3") facts.push(waitingFact(path));
    facts.push(reviewFact(path, "next", "next action", null), outcomeFact(path),
      reviewFact(path, "deadline", "deadline", "deadline"), areaFact(path),
      reviewFact(path, "orgs", "organisations", "org"), reviewFact(path, "people", "people", "with"),
      dependsFact(path));
  }
  if (pageKind(path) === "checklist") facts.push(checklistKindFact(path));
  const tracker = isTrackerPage(path);
  if (tracker) facts.push(...trackerFacts(path));
  const routine = canSchedule(path);
  if (routine) facts.push(cadenceFact(path));
  // A person always has the line, so the birthday is a click away, not a key to remember.
  if (pageKind(path) === "person" && !Object.keys(props).some(k => k.toLowerCase() === BIRTHDAY_PROP))
    facts.push(birthdayFact(path, BIRTHDAY_PROP, ""));
  // A responsibility always has its stakeholders line, set or not.
  const area = pageKind(path) === "area";
  if (area) facts.push(stakeholderFact(path));
  for (const [k, v] of Object.entries(props)) {
    if (/^template_(source|rules|hidden)$/.test(k)) continue;
    // Children have their own fact below, with a picker that refuses cycles.
    if (k === "children" || k === "parent_of") continue;
    // Which Planner card this is: the sync's business, like updated::.
    if (k === PLANNER_ID_PROP) continue;
    // Which Hide done switches are on: the switches show it.
    if (k === HIDE_DONE_PROP) continue;
    if (area && STAKE_PROPS.includes(k.toLowerCase())) continue;
    if (tracker && TRACKER_PAGE_KEYS.includes(k.toLowerCase())) continue;
    const own = FACT_OWN.includes(k.toLowerCase());
    if (own && (code || k.toLowerCase() === "title")) continue;
    if (own && pageKind(path) === "checklist" && k.toLowerCase() === "kind") continue;
    // A routine's schedule is the one cadence line above.
    if (routine && ROUTINE_OWN_PROPS.includes(k.toLowerCase())) continue;
    facts.push(Object.assign(propFact(path, k, v), {prop: k}));
  }
  facts.push(childrenFact({path, space: V.space}));
  return facts;
}
