/* A day-page line that starts with a verb is something to do (#326): "Call Bob
   about the quote" is a to do once you leave the line, as if typed after "· ".
   Off unless the area's GTD.md says verb_tasks:: on -- an area where you write
   prose, a book, would turn half its sentences into tasks.

   Left alone: a line that already started with that verb as a note (you kept
   it a note, or took the to do off), one word on its own, a question, and
   every line that is something else already -- a heading, an event or a
   feeling, a quote, a beat, a macro, a word-list line, a tracker. */
function verbTaskLine(path, text, before = "", space = V.space) {
  if (!isJournalPath(path)) return false;
  const on = inSpace(space, () => trim(String(getPage(SETTINGS_PATH)?.props?.verb_tasks || "")).toLowerCase());
  if (!["on", "yes", "true"].includes(on)) return false;
  const t = trim(String(text || ""));
  if (t.split(/\s+/).length < 2 || /\?\s*$/.test(t)) return false;
  if (HEAD_RE.test(t) || EVENT_RE.test(t) || FEEL_RE.test(t) || /^(>|%%|\{\{|\|)/.test(t)) return false;
  if (wordListMarks().some(m => t.startsWith(m + " "))) return false;
  if (parseTracker(t)) return false;
  if (!startsWithVerb(t)) return false;
  const was = String(before || "").replace(/\[\[[^\]]*(?:\]\[[^\]]*)?\]\]/g, " ");
  return !startsWithVerb(was);
}
