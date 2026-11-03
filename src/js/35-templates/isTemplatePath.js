/* 8/ holds templates, and also the timer's settings and the checklists, which
   are pages of their own and not templates. */
function isTemplatePath(path) {
  if (!path.startsWith(DIRS.lists + "/") || path === TIMER_PATH || path === SIDEBAR_PATH || isBookPath(path) || path === DARLINGS_PATH || isSnapshotPath(path) || isTrackerPage(path)) return false;
  // k.md is the template checklists are made from, and says type:: checklist itself.
  if (baseName(path) in TEMPLATE_DEFAULTS) return true;
  const props = getPage(path)?.props || {};
  return !/^checklist$/i.test(trim(props.type || "")) && !trim(props.kind || "");
}
