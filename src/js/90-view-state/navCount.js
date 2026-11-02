function navCount(id) {
  switch (id) {
    case "today":    return dueNow().length;
    case "next":     return myOpen().filter(a => a.state !== "WAIT").length;
    case "waiting":  return waitingRows().length;
    case "chat":     return allThreads().reduce((n, t) => n + (t.unread || 0), 0);
    case "projects": return visibleProjects("1").length;
    case "people":   return peopleRows().length;
    case "orgs":     return dirPagesInVisible("org").length;
    case "contexts": return allContextNames().length;
    case "chores":   return choreRows().filter(a => a.mine && choreGroup(a) === "due").length;
    case "pages":    return acrossSpaces(() => allPages(p => !isJournalPath(p) && pageKind(p) !== "verb")).length;
    case "review":   return attention().length;
    default:         return null;
  }
}
