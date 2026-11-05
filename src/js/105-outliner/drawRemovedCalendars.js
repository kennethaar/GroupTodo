/* Meetings left on the day pages by calendars no longer listed, one entry
   for each. Clearing is undoable, and the screen goes when none are left. */
function drawRemovedCalendars() {
  const left = calOrphans();
  if (!left.length) return drawCalendars();
  const names = calNames(), removed = calStamps(CAL_REMOVED_KEY);
  return calScreen({
    title: "Removed calendars", back: "Calendars", backTo: drawCalendars,
    body: el("div", {}, ...left.map(g => el("div", {class: "calfact"},
      el("div", {}, names[g.feed] || "A removed calendar"),
      el("div", {class: "lbl"}, (removed[g.feed] ? "Removed " + new Date(removed[g.feed]).toLocaleDateString(undefined, {day: "numeric", month: "short"}) + " · " : "") +
        g.n + (g.n === 1 ? " meeting remains" : " meetings remain")),
      el("button", {class: "textbtn", style: "margin-top:6px", onclick: () => {
        const r = clearCalendarMeetings(g.space, g.feed);
        let undone = false;
        const back = () => { if (undone) return false; undone = true; r.undo(); clearMemo(); render(); flush(); return true; };
        pushUndo({run: back, label: "Cleared calendar meetings"});
        clearMemo(); render(); flush();
        notify("Cleared " + r.removed + (r.removed === 1 ? " meeting" : " meetings") +
          (r.kept ? "; " + r.kept + " you wrote under stayed, as plain #meeting lines" : "") + ".", "info",
          {label: "Undo", run: () => { back(); drawRemovedCalendars(); return true; }});
        drawRemovedCalendars();
      }}, "Clear meetings")))),
  });
}
