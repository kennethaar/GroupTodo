/* A calendar that did not come in is said on Today, where its meetings were
   expected, not only in a dialog nobody opens again. */
function calendarProblem() {
  if (!calFeeds().length) return null;
  let last = null;
  try { last = JSON.parse(PREF.get("calendar.result", "null")); } catch (_) {}
  if (!last || !last.failed || !last.failed.length) return null;
  const noServer = last.failed.some(f => f.includes("nothing on this computer"));
  return el("div", {class: "calwarn", role: "status"},
    el("span", {class: "ic", "aria-hidden": "true"}, "\u{1F4C5}"),
    el("div", {class: "say"},
      el("b", {}, last.failed.length === 1 ? "A calendar did not come in." : last.failed.length + " calendars did not come in."), " ",
      noServer
        ? el("span", {}, "The app cannot reach a calendar link by itself, so a small helper on this computer fetches it. Start it in the GroupToDo folder with ",
            el("code", {}, "python serve.py --calendars-only"), " and leave it running, then try again.")
        : el("span", {}, last.failed.join("; ") + ".")),
    el("button", {class: "btn sm primary", onclick: () => syncCalendars({quiet: false})}, "Try again"),
    el("button", {class: "btn sm ghost", onclick: openCalendars}, "Calendars"));
}
