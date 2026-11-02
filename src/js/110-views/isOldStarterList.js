function isOldStarterList(page) {
  const lines = (page?.blocks || []).filter(b => trim(b.title || ""));
  return lines.length === OLD_STARTER_STEPS.length && lines.every((b, i) => trim(b.title) === OLD_STARTER_STEPS[i] &&
    !(b.children || []).some(k => trim(k.title || "")));
}
