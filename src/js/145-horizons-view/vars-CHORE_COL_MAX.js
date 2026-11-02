/* A board column shows this many rooms until its "+ n more" is clicked. */
const CHORE_COL_MAX = 5, CHORE_COLS_OPEN = new Set();
// The room's own name: kitchen, not home/kitchen, since every room is at home.
const roomLabel = ctx => (contextIcon(ctx) ? contextIcon(ctx) + " " : "@") + ctx.split("/").slice(1).join("/");

/* ---------- a room at a glance (#213) ----------
   What one room comes to: its freshness, how many are due, soon and fresh,
   the time the due ones take by their dots, the stalest, the next one up and
   whose turn it is, the last one done. Read off the lines, nothing stored. */
const choreRounds = a => (freshnessOf(a) || {rounds: 0}).rounds;
const turnFor = a => a.assignee || memo("turn:" + (a.space || V.space) + ":" + a.block.id,
  () => inSpace(a.space || V.space, () => whoseTurn(a.block)));
/* The chores ticked off at home, newest first, for the last one done in a room. */
const choresDone = () => memo("choresDone", () => acrossSpaces(() => {
  const out = [];
  for (const path of allPages(() => true)) for (const b of flattenBlocks(getPage(path).blocks)) {
    if (b.state !== "DONE" || !repeatOf(b)) continue;
    const ctx = blockContext(b);
    if (atHome(ctx)) out.push({ctx, title: b.title, day: closedOn(b) || "", who: closedBy(b) || ""});
  }
  return out;
}).sort((x, y) => y.day.localeCompare(x.day)));
