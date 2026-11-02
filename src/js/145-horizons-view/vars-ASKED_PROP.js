/* ============================================================
   ASKING SOMEBODY OUTSIDE FOR AN UPDATE
   Half of a shared list is work other people owe you, and the people who owe
   it to you are mostly not in your list. Waiting for already knows what they
   owe; what it could not do was ask. So you ended up writing the same email
   by hand every fortnight, pasting four task titles into it, and typing their
   reply back in one task at a time.

   One file does the round trip instead. You send them a self-contained HTML
   page -- no account, no invite, no server, the same bargain as the rest of
   GroupToDo. They double-click it, tick what they finished, type a note where
   a note is worth typing, and press one button. That writes a small markdown
   file. You open that file here and it lands on the right tasks.

   The check-in sheet is NOT a copy of your vault. It carries the titles you
   chose and nothing else: no project names, no colleagues, no other tasks,
   no files. Somebody forwarding it leaks four sentences, not a space.
   ============================================================ */

/* When you last asked, and who you asked. Dropped the moment they answer:
   "asked and heard nothing" is the thing worth measuring, and once they have
   replied there is nothing outstanding to measure. */
const ASKED_PROP = "asked";
const askedAt   = b => (trim(blockProp(b, ASKED_PROP) || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || null;
const askedDays = b => { const d = askedAt(b); return d ? dateDiffDays(d, todayISO()) : null; };
