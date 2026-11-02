function taskSort(view, dflt) {
  const sort = PREF.get(view + ".sort", dflt);
  const sel = iconSelect("\u21C5", "Sort", sort, [["urgency", "By urgency"], ["date", "By date"], ["age", "Oldest first"], ["est", "Shortest first"], ["name", "By name"]],
    v => { PREF.set(view + ".sort", v); render(); });
  const byDate = (x, y) => (x.due || "9999").localeCompare(y.due || "9999") || (x.added || "9999").localeCompare(y.added || "9999");
  const apply = list => {
    list.forEach(a => { a._showUrgency = sort === "urgency"; });
    return list.sort(sort === "urgency" ? byUrgency
      : sort === "date" ? byDate
      : sort === "est" ? (x, y) => byEst(x, y) || byDate(x, y)
      : sort === "name" ? byTaskName
      : (x, y) => (x.added || "9999").localeCompare(y.added || "9999"));
  };
  // Urgency is a number nobody can guess the meaning of, so it says where to read it.
  const dot = sort === "urgency" ? helpDot("urgency", "What is urgency?") : null;
  return {sort, sel, apply, dot};
}
