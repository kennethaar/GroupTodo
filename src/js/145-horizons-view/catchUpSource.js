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
  const also = catchUpAlso().split(/\r?\n/).map(s => trim(s.replace(/^[-*•]\s*/, ""))).filter(Boolean);
  const text = [
    "You help me keep my GTD project lists current. Search my email (sent and received), chats, meetings, " +
      "meeting transcripts and calendar from " + from + " to today, " + todayISO() + ". Search broadly and read all " +
      "the results before you answer. Compare them with my projects below and tell me what changed.",
    "",
    "WHAT COUNTS",
    "- Mail I sent shows what I did or promised. Mail I got shows what I was asked and what changed.",
    "- A transcript shows what was decided and who takes what. A calendar entry shows a meeting was held, not its outcome.",
    "- When sources disagree, the latest wins. Merge what came up more than once. Leave out what no source supports.",
    "- Leave out FYI, newsletters, notifications and what clearly belongs to others. When you are unsure it is mine, include it: I decide.",
    "",
    "Answer in one code block, one line per change and nothing else, in these forms:",
    "DONE <task ref>                         a task that is finished",
    "DUE <task ref> <YYYY-MM-DD>             a task's date that changed",
    "NOTE <task or project ref> <news>       news or progress, in one sentence, also work done with no task for it",
    "NEXT <project ref> <action> @<context>  a new next action, a physical step that starts with a verb, and where it is done",
    "WAIT <project ref> <person> | <what> | <YYYY-MM-DD>   something I now wait for from someone, and by when",
    "WAIT <task ref> <person> | <YYYY-MM-DD>               a task of mine that someone else now does",
    "TODO <action> @<context> | <YYYY-MM-DD>  a single action of mine that belongs to none of my projects",
    "PROJECT <title> | <outcome> | <first next action>     a new commitment of mine, more than one step, that is in none of my projects",
    "Write NO-DATE where there is no date.",
    "",
    "Write names of people as plain text, not as links. End a line with | and one bare link to the email, chat, " +
      "document or meeting it comes from, when you have one, and nothing after it.",
    ...(contextList().length ? ["My contexts: " + contextList().map(c => "@" + c).join(", ") + "."] : []),
    "",
    "Before you answer, check that you looked for: work done with no task for it, promises made in chats and meetings, " +
      "what I wait for from others, dates that moved, new projects, and projects whose state changed.",
    ...(also.length ? ["", "Also look for:", ...also.map(s => "- " + s)] : []),
    "",
    "Use only the references below. Today is " + todayISO() + ".",
    ...lines,
  ].join("\n");
  return {text, refs};
}
