/* On a project's page: what it has cost so far and what is still ahead. */
function projectCostSection(path) {
  const t = projectTally({space: V.space, path});
  const spent = fmtPrices(t.spent), planned = fmtPrices(t.planned);
  if (!spent && !planned) return null;
  return section("Cost", (spent || "nothing") + " spent / " + (planned || "nothing") + " planned",
    el("div", {class: "reportsum"}, "Spent is the prices on done tasks, planned the prices on open ones. Cancelled tasks count as neither."));
}
