/* ============================================================
   74b_PROJECT_CHAINS -- "this one cannot start until that one is finished"
   A plan is rarely a flat list of projects. The survey comes before the
   drawings, the drawings before the quote, the quote before the work. Until
   now that order lived in somebody's head, so a project could sit at the top
   of Active looking perfectly startable while the thing it actually waits on
   had not been touched.

   Stored as depends_on:: on the page, as ordinary wiki links -- the same shape
   outcome:: and area:: already use -- so the order is greppable markdown and
   survives the app. The links go through findExistingPage, which falls back to
   the slug across every status directory, so moving a prerequisite from 1/ to
   0/ does not break the chain.

   depends_on:: none says somebody has looked and nothing comes first, so the
   weekly review does not ask again; no depends_on:: at all means not asked yet.
   ============================================================ */
const DEPENDS_PROP = "depends_on";
const NOTHING_FIRST = "none";
