function urgencyParts(a) {
  const b = a.block, parts = [];
  const add = (why, n) => { n = Math.round(n * 10) / 10; if (n) parts.push([why, n]); };
  const above = d => d.own ? "" : ", from the line above";
  const dl = inheritedDay(b, "DEADLINE") || inheritedDay(b, "due");
  const sc = inheritedDay(b, "SCHEDULED");
  if (dl) add("deadline " + humanDate(dl.day) + above(dl), URGENCY.due * dueFactor(dl.day));
  else if (sc) add("scheduled " + humanDate(sc.day) + above(sc), URGENCY.due * dueFactor(sc.day));
  if (sc && sc.day <= todayISO()) add("its day has come", URGENCY.scheduled);
  const pri = priorityOf(b);
  if (pri) add("priority " + pri, URGENCY["priority" + pri]);
  if (b.state === "DOING") add("already started", URGENCY.doing);
  if (inContext(a, state.ctxFilter, true)) add("you are @" + a.context, URGENCY.here);
  const age = blockAge(b);
  if (age > 0) add(age + " days on the list", URGENCY.age * Math.min(age / 365, 1));
  if (a.project) add("in " + a.project, URGENCY.project);
  if (messagesOf(b).length) add("talked about", URGENCY.chat);
  const chain = chainTerms(a.projectPath, a.space);
  if (chain.blocking) add("another project waits on this one", URGENCY.blocking);
  if (chain.blocked) add("its project waits on another", URGENCY.blocked);
  if (b.state === "WAIT" || (a.mine === false && !isHousehold(a.assignee))) add("waiting for somebody", URGENCY.waiting);
  const fresh = freshnessOf(a);
  if (fresh && fresh.rounds > 1) add(Math.round(fresh.rounds * 100) + "% of the way round", URGENCY.chore * Math.min(fresh.rounds - 1, 1));
  return parts;
}
