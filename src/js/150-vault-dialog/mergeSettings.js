/* Settings must union rather than overwrite, or each sync would drop the
   other device's tombstones and we would resurrect deleted pages. */
function mergeSettings(incoming) {
  const mine = tombstones();
  const theirs = new Map();
  for (const part of (incoming.props?.deleted || "").split(";")) {
    const [p, t] = part.split("@");
    if (p && t) theirs.set(trim(p), trim(t));
  }
  for (const [p, t] of theirs) if (!mine.has(p) || mine.get(p) < t) mine.set(p, t);
  const local = settingsPage();
  for (const [k, v] of Object.entries(incoming.props || {})) {
    if (k === "deleted" || k === "updated") continue;
    if ((incoming.props.updated || "") > (local.props.updated || "")) local.props[k] = v;
  }
  writeTombstones(mine);
}
