/* Catch up (#516): the prompt for an AI that can read your mail, chats and
   meetings, and the short references in it. Active and waiting projects come
   with their open tasks; projects done since the look-back day (30 days at
   least) are named so the AI does not offer them as new; the area's contexts
   are listed so a new next action comes with one. Names are not hidden (#345 does that for a
   message): the AI has to match people in your mail to your waiting-fors.
   refs: "T1" -> {path, block, proj}, "P1" -> {path, proj: path}. */
function catchUpSource(from = catchUpSince()) {
  const refs = new Map(), lines = [];
  const iso = days => new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const since = [from, iso(CATCHUP_DONE_DAYS)].sort()[0];
  const projects = code => [...V.pages.keys()].filter(p => statusDirOf(p) === code && !isHorizonPage(p))
    .sort((a, b) => pageTitle(a).localeCompare(pageTitle(b)));
  let p = 0, t = 0;
  for (const [code, head] of [["1", "ACTIVE PROJECTS"], ["3", "WAITING PROJECTS (on hold until someone else acts)"]]) {
    const list = projects(code);
    if (!list.length) continue;
    lines.push("", head);
    for (const path of list) {
      const pr = "P" + (++p);
      refs.set(pr, {path, proj: path});
      const outcome = trim(getPage(path).props.outcome || "");
      lines.push(pr + " " + pageTitle(path) + (outcome ? " — outcome: " + plainTitle(outcome) : ""));
      const open = projectActions({space: V.space, path}).filter(a => OPEN_STATES[a.state] && a.block);
      for (const a of open) {
        const tr = "T" + (++t);
        refs.set(tr, {path: a.path || path, block: a.block, proj: path});
        const who = a.state === "WAIT" ? waitingPersonOf(a.block, getPage(a.path || path)) : "";
        const due = dueDate(a.block);
        lines.push("  " + tr + " " + (a.state === "WAIT" ? "Waiting for" + (who ? " " + who : "") + ": " : "") +
          plainTitle(a.block.title) + (due ? " (due " + due + ")" : ""));
      }
    }
  }
  const done = projects("0").filter(path => {
    let last = "";
    walkBlocks(getPage(path).blocks || [], b => { const d = closedOn(b); if (d && d > last) last = d; });
    return last >= since;
  });
  if (done.length) lines.push("", "DONE SINCE " + since + " (do not offer these again)",
    ...done.map(path => "- " + pageTitle(path)));
  const text = [
    "You help me keep my GTD project lists current. Look through my email, chats, meetings and calendar " +
      "from " + from + " to today, " + todayISO() + ". Compare them with my projects below and tell me what changed.",
    "",
    "Answer in one code block, one line per change and nothing else, in these forms:",
    "DONE <task ref>                         a task that is finished",
    "DUE <task ref> <YYYY-MM-DD>             a task's date that changed",
    "NOTE <task ref> <news>                  news on a task, in one sentence",
    "NEXT <project ref> <action> @<context>  a new next action, a physical step that starts with a verb, and where it is done",
    "WAIT <project ref> <person> | <what> | <YYYY-MM-DD>   something I now wait for from someone, and by when",
    "TODO <action> @<context> | <YYYY-MM-DD>  a single action of mine that belongs to none of my projects; the date only if it has one",
    "PROJECT <title> | <outcome> | <first next action>     a new commitment of mine, more than one step, that is in none of my projects",
    "",
    "NEXT, TODO and PROJECT are what I still need to capture. Give only what I promised or was asked to do myself. " +
      "Leave out FYI, newsletters, notifications and what others will do. One line per commitment, however often it came up.",
    "",
    "End a line with | and a link to the email, chat, document or meeting it comes from, when you have one.",
    ...(contextList().length ? ["My contexts: " + contextList().map(c => "@" + c).join(", ") + "."] : []),
    "Use only the references below. Leave out anything you are not sure of. Today is " + todayISO() + ".",
    ...lines,
  ].join("\n");
  return {text, refs};
}
