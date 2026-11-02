function meetLead(b) {
  if (!meetLeads(b)) return null;
  const c = meetingClock(b);
  const span = clockHM(c.start) + (c.end != null ? "–" + clockHM(c.end) : "");
  return el("span", {class: "ltime", title: span},
    clockHM(c.start), c.end != null ? el("span", {class: "lend"}, "–" + clockHM(c.end)) : null);
}
