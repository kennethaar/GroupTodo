function usageSummary() {
  const {weeks, rows} = usageStats(), worth = usageWorth();
  const head = "| Place | Weeks used of " + weeks + " | Days | Visits | Minutes | Per visit | Actions | Worth it |\n" +
               "|---|---|---|---|---|---|---|---|\n";
  return "GroupToDo use over the last " + weeks + " week(s)\n\n" + head + usageSorted(rows).map(x =>
    "| " + usageLabel(x.place) + " | " + x.weeks.size + " | " + x.days.size + " | " + x.visits + " | " +
    usageMin(x.secs) + " | " + usagePerVisit(x) + " | " + x.acts + " | " +
    ((USAGE_WORTH.find(o => o[0] === worth[x.place]) || [])[1] || "") + " |").join("\n") + "\n";
}
