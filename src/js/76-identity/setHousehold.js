function setHousehold(path, on) {
  const page = getPage(path);
  if (!page) return;
  for (const k of Object.keys(page.props)) if (k.toLowerCase() === HOUSEHOLD_PROP) delete page.props[k];
  if (on) page.props[HOUSEHOLD_PROP] = "true";
  touch(path); clearMemo(); render();
  notify(on ? personName(path) + " is in the household: they take turns at the chores and get the points."
    : personName(path) + " is no longer in the household.");
}
