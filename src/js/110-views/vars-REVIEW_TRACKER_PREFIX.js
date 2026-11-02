/* ---------- the review, as trackers ----------
   Each tick is written as it happens, on the day the review was started, as
   a done-or-not tracker under a "Weekly review" line: tracker-review-papers_c::
   x. Every step gets its line, ticked or not, so a step you keep skipping
   shows up as skipped rather than as nothing. */
const REVIEW_TRACKER_PREFIX = "review-";
