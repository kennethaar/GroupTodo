function usageLabel(place) {
  const [kind, ...more] = place.split("/"), rest = more.join("/");
  if (kind === "dialog") return rest + " (dialog)";
  if (kind === "page") return USAGE_PAGE_KINDS[rest] || rest;
  const sub = (SUBS[kind] || []).find(s => s[0] === rest);
  return (VIEW_TITLE[kind] || kind) + (sub ? " · " + sub[1] : "");
}
