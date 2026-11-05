/* Calendars in Settings, and only in an area that is yours alone: that is
   the one place a calendar comes into (#218). In a shared area the section
   stays, with a note on where to go, so it is not simply missing. */
function calendarSettingsSection() {
  if (!Spaces.active) return null;
  if (calAreaShared(Spaces.active))
    return section("Calendars", null, el("div", {class: "card calset"},
      el("div", {class: "listblurb"}, calSharedWhy(Spaces.active) + ". Switch to a private area, then open Settings again.")));
  return section("Calendars", null, el("div", {class: "card calset"},
    el("div", {class: "listblurb"}, "Meetings from your calendars, as #meeting lines on your day pages. On this device."),
    calChip()));
}
