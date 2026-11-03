/* ---------- as needed (#239) ----------
   Laundry when the basket is full has no rhythm, but it is work all the same.
   An as-needed chore is a plain line at @home with repeat:: as needed: not a
   task, so it is never late and never on Next or the Journal by itself. Did
   it, or Log a chore for anything else done at home, writes one done line on
   that day's page, with its room and the done_by:: a tick writes, and
   repeat:: as needed so Points, whose turn and the Report count it as they
   count a scheduled one. */
const AS_NEEDED = "as needed";
const isAsNeeded = spec => /^as[ -]needed$/i.test(trim(spec || ""));
const asNeededChores = () => memo("asNeeded", () => acrossSpaces(() => {
  const out = [];
  for (const path of allPages(() => true)) for (const b of flattenBlocks(getPage(path).blocks)) {
    const ctx = blockContext(b);
    if (!b.state && isAsNeeded(repeatOf(b)) && atHome(ctx)) out.push({path, block: b, ctx, title: b.title});
  }
  return out;
}));
/* A done line logged by hand, or from an as-needed chore. */
const isLoggedChore = b => !!b && b.state === "DONE" && isAsNeeded(repeatOf(b));
const choreLine = (words, ctx, size) => trim(withEst(trim(words), size) + " [[c/" + ctx + "]]");
