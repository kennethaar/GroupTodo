/* One picker, remembered, so the second time is a single click. */
function openCalendarPicker(items) {
  const dated = items.filter(a => a.due);
  if (!dated.length) { notify("Nothing here has a date yet.", "warn"); return; }
  const body = el("div", {});
  body.append(el("div", {class: "field"},
    el("div", {style: "font-size:13.5px"},
      dated.length === 1 ? "\u201C" + titleForRow(dated[0].title) + "\u201D on " + humanWhen(dated[0].due, calWhen(dated[0]).time) + "."
        : dated.length + " dated tasks."),
    el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
      "A file is made here and goes nowhere. The links open your calendar's own new-event " +
      "screen, which means the title and date travel in the web address - fine for a " +
      "meeting, worth a thought for anything private.")));
  const list = el("div", {});
  for (const [kind, label] of CALENDARS) {
    list.append(el("button", {class: "pick", onclick: () => {
      PREF.set(CAL_PREF_KEY, kind);
      closeModal();
      sendToCalendar(kind, dated);
    }},
      el("span", {class: "k"}, kind === "ics" ? "\u2193" : "\u2197"),
      el("span", {style: "flex:1"}, label),
      calendarChoice() === kind ? el("span", {class: "d"}, "last used") : null));
  }
  body.append(el("div", {class: "field"}, el("label", {}, "Send it to"), list));
  modal({center: true, title: "Add to calendar", body,
         foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel")]});
}
