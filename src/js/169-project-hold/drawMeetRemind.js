/* One choice, saved when picked. Asking for notifications needs a click, and
   choosing a time is that click. */
function drawMeetRemind() {
  const lead = meetRemindLead();
  const cur = lead == null ? "off" : lead === 0 ? "start" : String(lead);
  calScreen({
    title: "Meeting reminder", back: "Calendars", backTo: drawCalendars,
    body: el("div", {role: "radiogroup", "aria-label": "Meeting reminder", style: "padding:4px 16px"},
      ...MEET_REMIND_CHOICES.map(([v, text]) => el("label", {class: "calpick"},
        el("input", {type: "radio", name: "meetremind", checked: v === cur ? "" : null, onchange: () => {
          PREF.set(MEET_REMIND_KEY, v);
          try { if (v !== "off" && window.Notification?.permission === "default") Notification.requestPermission(); } catch (_) {}
          meetingTick();
        }}), text))),
  });
}
