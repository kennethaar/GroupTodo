/* Calendars in Settings, and only in an area that is yours alone: that is
   the one place a calendar comes into (#218). In a shared area the section
   stays, with a note on where to go, so it is not simply missing. A folder
   that only looks shared because it is open on your other devices can be
   marked as just you. */
function calendarSettingsSection() {
  if (!Spaces.active) return null;
  const sp = Spaces.get(Spaces.active);
  const onlyMe = el("input", {type: "checkbox"});
  onlyMe.checked = !!sp?.onlyMe;
  onlyMe.onchange = async () => {
    if (onlyMe.checked) sp.onlyMe = todayISO(); else delete sp.onlyMe;
    await Spaces.save(); clearMemo(); render();
  };
  const mine = el("label", {class: "listblurb", style: "display:flex;gap:6px;align-items:center"},
    onlyMe, "Only I use this folder, on my other devices");
  if (calAreaShared(Spaces.active))
    return section("Calendars", null, el("div", {class: "card calset"},
      el("div", {class: "listblurb"}, calSharedWhy(Spaces.active) + ". If the others are just you on other devices, tick the box below. Otherwise switch to a private area."),
      mine));
  return section("Calendars", null, el("div", {class: "card calset"},
    el("div", {class: "listblurb"}, "Meetings from your calendars, as #meeting lines on your day pages. On this device."),
    calChip(),
    sp?.onlyMe ? mine : null));
}
