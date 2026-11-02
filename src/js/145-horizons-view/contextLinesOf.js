/* The lines written under a task: the notes that say what it is about, which
   is what somebody outside needs in order to answer it. The conversation on
   the task stays out, because that is a thread among you, not a note to them.
   Each line knows how deep it sits, so the mail and the sheet can indent it. */
function contextLinesOf(block) {
  const out = [];
  const walk = (b, depth) => {
    for (const line of b.body || []) { const t = plainTitle(line); if (t) out.push({depth, text: t}); }
    for (const c of b.children || []) {
      if (isMessage(c)) continue;
      const t = plainTitle(c.title);
      if (t) out.push({depth, text: (c.state === "DONE" ? "✓ " : c.state === "CANCELLED" ? "✗ " : "") + t});
      walk(c, depth + 1);
    }
  };
  walk(block, 0);
  return out;
}
