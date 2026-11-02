const estMinutes = title => estTier(title) * 15 || null;
const withoutEst = title => EST_TAGS.slice(1).reduce((t, tag) => hasTag(t, tag) ? withoutTag(t, tag) : t, String(title || ""));
const withEst = (title, n) => n ? withTag(withoutEst(title), EST_TAGS[n]) : withoutEst(title);
/* The dots typed in front of a task's words, made into its tag. Only with a
   space after them, so "...and then" stays a sentence. */
const EST_DOTS_RE = /^(\.{1,4})\s+(?=\S)/;
