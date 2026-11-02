/* ============================================================
   WHAT GOT DONE, AND WHEN
   A report is a different question from a to-do list: not "what is left" but
   "what did we actually finish". The answer is already in the files -- done_by::
   is stamped on the tick, and CLOSED:: or the "- [[end]]" half of Added:: is
   what older entries and hand-edited files carry -- so this reads, it does not
   record.
   ============================================================ */

/* Who ticked it off, without the timestamp that follows the name. */
const closedBy = b => splitStamp(blockProp(b, "done_by") || "").who;

/* The day it was ticked off, from whichever of the three the file has. */
const closedOn = b => (trim(blockProp(b, "done_by") || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0]
  || closedDate(b) || null;

/* ---------- who the work was for ----------
   There is no customer field, and there does not need to be one: an org is a
   page like any other -- pages/o/Acme -- so "this was for Acme" is already
   written as a link to it. This reads that link out of wherever somebody
   naturally put it: on the task, on a bullet above it, on the page the task
   lives on, or on the project the task belongs to. */
const ORG_LINK = /\[\[o\/([^\]]+)\]\]/g;
// A supplier on the line is who helped, not who it was for, so it is passed over.
const orgIn = text => { for (const m of String(text || "").matchAll(ORG_LINK)) if (!isSupplier(trim(m[1]))) return trim(m[1]); return ""; };
