/* The same title with the link syntax read out rather than shown. A calendar
   cell has no room for a chip, and a link nested inside a button is both bad
   markup and two things to press in one. */
/* Every [[link]] read out as the words it stands for, dropping nothing. The
   grid uses this rather than stripping the links: a title is often mostly
   links, and "Ring about the quote" with the person and the org taken out of it
   is a line you cannot identify in a list of six. */
function linkWords(text) {
  return trim(String(text || "").replace(/\[\[([^\]]+(?:\]\[[^\]]*)?)\]\]/g, (all, t) => {
    if (t.includes("][")) return trim(t.split("][")[1]);
    const raw = trim(t);
    const pfx = (/^([^/]+)\//.exec(raw) || [])[1];
    if (pfx === "go") return tourLabel(raw.slice(3));
    const known = pfx === "c" || pfx === "z" || pfx === "p" || pfx === "o" || (pfx && STATUS_DIRS[pfx]);
    // An email is its subject, as it reads in the app, without the m/ (#159).
    const label = known || pfx === "m" ? raw.slice(pfx.length + 1) : raw;
    return pfx === "c" ? "@" + label : label;
  }).replace(/\s{2,}/g, " "));
}
