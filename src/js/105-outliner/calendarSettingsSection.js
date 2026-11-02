/* Calendars in Settings, and only in an area that is yours alone: that is
   the one place a calendar comes into (#218). */
function calendarSettingsSection() {
  if (!Spaces.active || calAreaShared(Spaces.active)) return null;
  return section("Calendars", null, el("div", {class: "card calset"},
    el("div", {class: "listblurb"}, "Meetings from your calendars, as #meeting lines on your day pages. On this device."),
    calChip()));
}
