/* A template with nothing left in it but its name. */
const emptyTemplate = page => !(page.blocks || []).some(b => trim(b.title) || (b.children || []).length || (b.body || []).length) &&
  Object.keys(page.props || {}).every(k => /^(title|created)$/i.test(k));
/* A template holding trackers and nothing else -- the kind a run of days writes. */
const onlyTrackers = page => !!page && (page.blocks || []).every(b => !trim(b.title) || (parseTracker(b.title) && !(b.children || []).length)) &&
  Object.keys(page.props || {}).every(k => /^(title|created)$/i.test(k) || parseTracker(k + "::"));
