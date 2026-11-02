function templateChoiceItems(prefix) {
  const wanted = String(prefix || "").toLowerCase() + "/";
  return allPages(p => pageRef(p).toLowerCase().startsWith(wanted))
    .map(p => ({label: pageTitle(p), detail: pageRef(p), value: "[[" + pageRef(p) + "]]"}));
}
