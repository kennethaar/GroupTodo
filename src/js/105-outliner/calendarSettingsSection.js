/* Calendars in Settings: the same setup as the Calendars dialog the date
   box opens, in any area (#397). A calendar comes into a private area
   either way (#218); + Add calendar says so where that matters. A folder
   that only looks shared because it is open on your other devices can be
   marked as just you, here. */
function calendarSettingsSection() {
  const sp = Spaces.active ? Spaces.get(Spaces.active) : null;
  const all = fn => async () => {     // as openCalendars: every area read in first
    await Promise.all(Spaces.list.filter(s => !LOADED.has(s.name)).map(s => loadSpaceRecord(s.name).catch(() => null)));
    fn();
  };
  const c = calendarsBody(all, render);
  let mine = null;
  if (sp && (sp.onlyMe || calAreaShared(Spaces.active))) {
    const onlyMe = el("input", {type: "checkbox"});
    onlyMe.checked = !!sp.onlyMe;
    onlyMe.onchange = async () => {
      if (onlyMe.checked) sp.onlyMe = todayISO(); else delete sp.onlyMe;
      await Spaces.save(); clearMemo(); render();
    };
    mine = el("label", {class: "listblurb", style: "display:flex;gap:6px;align-items:center"},
      onlyMe, "Only I use this folder, on my other devices");
  }
  return section("Calendars", null, el("div", {class: "card calset"},
    c.body,
    c.sync || c.foot ? el("div", {class: "calfoot", style: "display:flex;gap:12px;align-items:center;padding:4px 16px 10px"},
      ...(c.foot || []), c.sync) : null,
    mine));
}
