function linkCandidates(query) {
  const m = /^([^/]*)\/(.*)$/.exec(query);
  const pfx = m ? m[1] : null;
  const rest = trim(m ? m[2] : query).toLowerCase();
  const dir = pfx != null ? linkDirFor(pfx) : null;

  let paths;
  if (pfx != null && dir) paths = allPages(q => q.startsWith(dir + "/"));
  else if (pfx != null) paths = [];            // a prefix of its own invention
  else paths = allPages(q => pageKind(q) !== "verb");

  /* Any page's alias finds it too, and is what the link then reads:
     [[js picks p/John Smith as [[p/John Smith][JS]]. A context keeps its own
     name, so the line still knows its context. */
  const rows = paths.map(path => ({
    path, ref: pageRef(path), title: pageTitle(path), kind: pageKind(path),
  })).map(r => {
    if (!rest || r.title.toLowerCase().includes(rest) || r.ref.toLowerCase().includes(rest)) return r;
    const a = pageAliases(r.path).find(x => x.toLowerCase().startsWith(rest));
    return a ? Object.assign(r, {label: r.kind === "context" ? undefined : a, detail: "as " + a,
      exact: a.toLowerCase() === rest}) : null;
  }).filter(Boolean);

  // What you typed the start of beats what merely contains it somewhere.
  const score = r => (r.exact ? 4 : 0) + (r.title.toLowerCase().startsWith(rest) ? 2 : 0) +
                     (r.ref.toLowerCase().startsWith(rest) ? 1 : 0);
  rows.sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title));
  const out = rows.slice(0, 10);

  /* Nothing that matches exactly is still a usable link: typing it makes the
     page. Offered last, so it never steals the Enter from a real page, and only
     once there is a name to make - "Make c/" would be a page called nothing. */
  const typed = trim(query);
  const named = trim(m ? m[2] : query);
  if (typed && named && !out.some(r => r.exact || r.ref.toLowerCase() === typed.toLowerCase()
                                    || r.title.toLowerCase() === typed.toLowerCase())) {
    out.push({ref: typed, title: typed, kind: null, isNew: true});
  }
  return out;
}
