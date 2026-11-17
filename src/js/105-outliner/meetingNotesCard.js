function meetingNotesCard(path) {
  if (!isJournalPath(path) || !myJournal(path) || meetingTipOff()) return null;

  const off = () => { PREF.set("tip.off.meeting", "1"); render(); };
  const text = (t, more = "") => el("div", {style: "font-size:13.5px;color:var(--fg2);line-height:1.55" + more}, t);
  const code = t => el("code", {}, t);

  const box = el("div", {class: "coach tip"});
  box.append(el("div", {class: "coach-head"},
    el("b", {}, "Capture everything as it happens"),
    el("button", {class: "iconbtn", title: "Do not show this again", onclick: off}, "✕")));

  box.append(text("Type notes, meetings, and ideas here. Everything is saved automatically, " +
    "and your task lists pull directly from this page."));

  // Each key, then what it does (#424).
  const key = (keys, ...what) => el("li", {}, el("b", {}, ...keys), " — ", ...what);
  box.append(el("ul", {class: "coach-keys"},
    key([code("Ctrl+Enter")], "Cycle task status (", code("TODO"), " → ", code("DOING"), " → ", code("WAIT"), " → ", code("DONE"), ")"),
    key([code("Tab"), " / ", code("Shift+Tab")], "Indent to group items under a project or task"),
    key([code("[[1/Project Name]]")], "Turn a line into a project"),
    key([code("/"), " or ", code("Ctrl+.")], "Open the command menu (", code("/todo"), ", ", code("/project"), ", ", code("/meeting"), ")")));

  /* The example plays as it would be typed, once a session (#427); a redraw
     carries a run on, and reduced motion shows only the finished example. */
  box.append(el("div", {class: "coach-exlab"}, el("b", {}, "Example:")));
  const ex = el("div", {class: "coach-ex", translate: "no"});
  const wrap = el("div", {class: "coach-demo"}, ex);
  box.append(wrap);
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still) wrap.append(el("div", {class: "coach-cap", "aria-live": "polite"}));
  if (still) meetingTipDraw(ex, meetingTipFinal());
  else if (MEETING_DEMO_RUN) { MEETING_DEMO_RUN.host = ex; meetingTipDraw(ex, MEETING_DEMO_RUN.s); }
  else if (!MEETING_DEMO_PLAYED) {
    meetingTipDraw(ex, {lines: [], caption: "", n: 0, popup: null});
    setTimeout(() => { if (ex.isConnected && !MEETING_DEMO_RUN && !MEETING_DEMO_PLAYED) meetingTipDemo(ex); }, 600);
  } else meetingTipDraw(ex, meetingTipFinal());

  box.append(text("Indented tasks automatically appear on the project’s page and in your task lists. " +
    "Plain indented lines stay attached as notes.", ";margin-top:8px"));

  box.append(el("div", {style: "display:flex;gap:8px;margin-top:11px;flex-wrap:wrap;justify-content:flex-end"},
    still ? null : el("button", {class: "btn sm ghost", title: "Play the example again", onclick: () => meetingTipDemo(ex)}, "↻ Replay"),
    el("button", {class: "btn sm ghost", onclick: off}, "Got it")));
  return box;
}
