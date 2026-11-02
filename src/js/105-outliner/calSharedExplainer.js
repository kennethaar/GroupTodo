function calSharedExplainer() {
  return el("div", {class: "calwarn", style: "margin:0 0 12px"},
    el("span", {class: "ic", "aria-hidden": "true"}, "\u{1F512}"),
    el("div", {class: "say"},
      el("b", {}, "Calendars come into your own area, which is yours alone."), " ",
      el("span", {}, "In an area with other people, everyone in it can read your day pages, so they would see every " +
        "meeting in your calendar: private appointments, who you meet and the agendas. The links stay on this device."),
      el("br"), el("br"),
      el("b", {}, "Meetings that concern the others: "),
      el("span", {}, "tick an area under “Also show in” for all of a calendar's meetings, or open one meeting " +
        "(Alt+M) and choose where that one shows. Each is a synced copy of that meeting alone, so the notes written under " +
        "it are kept in step both ways; the rest of your calendar stays yours.")));
}
