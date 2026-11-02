function viewScrollKey() {
  const fields = {page: ["pagePath"], projects: ["statusCode", "org"], search: ["query", "searchFilter"],
                  next: ["ctxFilter"], today: ["jz", "todayWho", "todayDay", "todayWeek"], pages: ["graphFocus"],
                  help: ["helpTopic"]};
  return JSON.stringify([Spaces.active, state.view, subNow(),
    ...(fields[state.view] || []).map(k => state[k] ?? null)]);
}
