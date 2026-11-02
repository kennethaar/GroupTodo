/* Deeplinks. Outlook on the web -- "new Outlook" included, which is the web
   app in a window -- takes a compose URL; Google takes a template URL. */
function calendarLink(kind, a) {
  const title = titleForRow(a.title);
  const w = calWhen(a);
  const body = [a.project ? "Project: " + a.project : null,
                a.context ? "Context: @" + a.context : null].filter(Boolean).join("\n");
  if (kind === "outlook" || kind === "outlook-personal") {
    const host = kind === "outlook" ? "https://outlook.office.com" : "https://outlook.live.com";
    return host + "/calendar/0/deeplink/compose?" + new URLSearchParams({
      path: "/calendar/action/compose", rru: "addevent", allday: String(!w.time),
      subject: title, body,
      startdt: w.time ? w.day + "T" + w.time + ":00" : w.day,
      enddt: w.time ? w.endDay + "T" + w.endTime + ":00" : w.endDay,
    }).toString();
  }
  if (kind === "google") {
    return "https://calendar.google.com/calendar/render?" + new URLSearchParams({
      action: "TEMPLATE", text: title,
      dates: w.time ? icsStamp(w.day, w.time) + "/" + icsStamp(w.endDay, w.endTime)
                    : icsDate(w.day) + "/" + icsDate(w.endDay),
      details: body,
    }).toString();
  }
  return null;
}
