/* A line in the talk as it is presented (#470): a line that is only an
   {{embed ((id))}} is the line it points to, with its own lines, as if it
   were written there; so an edit on the slide changes the original. One
   whose line is gone is null. So is one that would bring itself back in
   (a line embedding the slide it is on), which would go round for ever.
   `memo` holds what each embed line came to, for one talk. */
function slideEmbed(b, memo) {
  const m = SLIDE_EMBED_RE.exec(b?.title || "");
  if (!m) return b;
  if (memo.has(b)) return memo.get(b);
  memo.set(b, null);                  // while looking: a way back to here is a loop
  const to = blockById(m[1])?.block || null;
  const seen = new Set();
  const back = x => {
    if (!x || seen.has(x)) return false;
    seen.add(x);
    if (x === b) return true;
    const e = SLIDE_EMBED_RE.exec(x.title || "");
    if (e && back(blockById(e[1])?.block)) return true;
    return (x.children || []).some(back);
  };
  const got = to && !back(to) ? to : null;
  memo.set(b, got);
  return got;
}
