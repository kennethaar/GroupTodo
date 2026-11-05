/* A duration tag as exact minutes: #5m, #90m, #1h, #1h30m, #2h15m (#283). */
const estParse = tag => {
  const m = /^(?:(\d+)h)?(?:(\d+)m)?$/i.exec(tag);
  return (m && (m[1] || m[2])) ? (+m[1] || 0) * 60 + (+m[2] || 0) : 0;
};
/* The minutes are the truth; the dots are only their band (#283). */
const estMinutes = title => {
  const std = estTier(title) * 15;
  return std || tagsIn(title).map(estParse).find(Boolean) || null;
};
const estBand = title => { const m = estMinutes(title); return !m ? 0 : m <= 15 ? 1 : m <= 30 ? 2 : m <= 45 ? 3 : 4; };
const withoutEst = title => tagsIn(title).filter(t => estParse(t)).reduce((s, tag) => withoutTag(s, tag), String(title || ""));
const withEst = (title, n) => {
  const base = withoutEst(title);
  return n ? withTag(base, typeof n === "string" ? n : EST_TAGS[n]) : base;
};
const estTagOf = title => tagsIn(title).find(t => estParse(t)) || "";
/* The dots typed in front of a task's words, made into its tag. Only with a
   space after them, so "...and then" stays a sentence. */
const EST_DOTS_RE = /^(\.{1,4})\s+(?=\S)/;
