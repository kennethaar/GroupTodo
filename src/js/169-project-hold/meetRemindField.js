/* The setting, as Calendars shows it. Asking for notifications needs a click,
   and choosing a time is that click. */
function meetRemindField() {
  const sel = el("select", {onchange: e => {
    PREF.set(MEET_REMIND_KEY, e.target.value);
    try { if (+e.target.value && window.Notification?.permission === "default") Notification.requestPermission(); } catch (_) {}
    meetingTick();
  }}, ...MEET_REMIND_CHOICES.map(n => el("option", {value: String(n), selected: n === meetRemindMin() ? "" : null},
    n ? n + " minutes before" : "Off")));
  return el("div", {class: "field"}, el("label", {}, "Remind me before a meeting"), sel,
    el("div", {class: "hint", style: "text-align:left;margin-top:4px"},
      "For every #meeting line with a time on today's page, from a calendar or written by hand. On this device only."));
}
