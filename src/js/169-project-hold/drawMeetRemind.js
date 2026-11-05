/* Presets, saved when picked: one click for the common case. Custom… holds any
   other time and several at once. url is a calendar with its own reminders.
   Asking for notifications needs a click, and choosing a time is that click. */
const meetAskNotify = leads => {
  try { if (leads.length && window.Notification?.permission === "default") Notification.requestPermission(); } catch (_) {}
};
function drawMeetRemind(url = null) {
  const feed = url ? calFeedId(url) : null, f = url && calFeeds().find(x => x.url === url);
  const leads = meetRemindLeads(feed), cur = meetRemindValue(leads);
  const preset = MEET_REMIND_CHOICES.some(([v]) => v === cur);
  const title = url ? "Reminders" : "Meeting reminder";
  calScreen({
    title, back: url ? (f.label || calHost(url)) : "Calendars", backTo: url ? () => drawCalendarSettings(url) : drawCalendars,
    body: el("div", {style: "padding:4px 16px"},
      el("div", {role: "radiogroup", "aria-label": title},
        ...MEET_REMIND_CHOICES.map(([v, text]) => el("label", {class: "calpick"},
          el("input", {type: "radio", name: "meetremind", checked: v === cur ? "" : null, onchange: () => {
            const l = meetRemindLeads(null, v);
            setMeetRemind(url, l);
            meetAskNotify(l);
            meetingTick();
          }}), text))),
      el("button", {class: "pick calrow", style: "margin:6px -16px 0;width:calc(100% + 32px)", onclick: () => drawMeetRemindCustom(url)},
        el("span", {class: "calrowt"}, "Custom…"),
        preset ? null : el("span", {class: "sub"}, meetRemindLabel(feed)),
        el("span", {class: "chev", "aria-hidden": "true"}, "›"))),
  });
}
