/* Projects > Hours: the clock on the clients' projects, or who was on site. */
function viewHours() {
  const clients = sheetEntries(sheetById("clients")).length > 0, site = timeLogEntries().length > 0;
  const of = state.hoursOf === "site" || state.hoursOf === "clients" ? state.hoursOf : clients || !site ? "clients" : "site";
  const c = el("div", {});
  c.append(fbar(fchip("Clients", of === "clients", () => go("projects", {sub: "hours", hoursOf: "clients"})),
    fchip("Time on site", of === "site", () => go("projects", {sub: "hours", hoursOf: "site"}))));
  c.append(of === "clients" ? viewSheet(sheetById("clients")) : viewSiteHours());
  return c;
}
