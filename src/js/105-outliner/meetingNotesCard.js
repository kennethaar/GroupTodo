function meetingNotesCard(path) {
  if (!isJournalPath(path) || !myJournal(path) || meetingTipOff()) return null;

  const ex = lines => el("div", {class: "coach-ex", html: lines.join("\n")});
  const lab = text => el("div", {class: "coach-exlab"}, text);
  const line = text => el("div", {style: "font-size:13.5px;color:var(--fg2);line-height:1.55;margin-top:8px"},
    el("span", {html: text}));

  const box = el("div", {class: "coach tip"});
  box.append(el("div", {class: "coach-head"},
    el("b", {}, "Type it in here, while it is happening"),
    el("button", {class: "iconbtn", title: "Do not show this again",
      onclick: () => { PREF.set("tip.off.meeting", "1"); render(); }}, "✕")));

  box.append(el("div", {style: "font-size:13.5px;color:var(--fg2);line-height:1.55"},
    "A meeting, a book, a course: every line, as it comes. Nothing here has to " +
    "be a task yet, and nothing gets lost by not being one - this page is the " +
    "record of the day, and the lists read it."));

  box.append(el("div", {class: "coach-why"},
    el("div", {}, el("b", {}, "Ctrl+Enter"), " on a line makes it a task - TODO, then DOING, WAIT, DONE."),
    el("div", {}, el("b", {}, "Tab"), " indents it, and indentation is what says things belong together; " +
      "Shift+Tab moves it back out."),
    el("div", {}, "Write ", el("b", {}, "[[1/Some name]]"), " in a line and that is a project, " +
      "started from the words you were already typing."),
    el("div", {}, "Or type ", el("b", {}, "/"), " in the line for what it can be: ", el("b", {}, "/todo"), ", ",
      el("b", {}, "/project"), ", ", el("b", {}, "/meeting"), ", ", el("b", {}, "/in"), ". " +
      "The same are on the \u22EF at the end of the line (Ctrl+.).")));

  box.append(lab("A meeting, typed as it ran:"));
  box.append(ex([
    "Weekly sync · product",
    "  Relaunch the website <b>[[1/Relaunch the website]]</b>",
    "    <b>TODO</b> Write the new pricing copy [[c/computer]]",
    "    <b>TODO</b> Ask Ada for the logo files",
    "      she is out until Thursday",
    "  The printer on 3 is dead again",
  ]));
  box.append(line(
    "The two tasks are indented under the project line, so they are that " +
    "project's tasks - they show up on its page, and in your lists, although " +
    "they live here in today's notes. The plain line under the second one is a " +
    "note on that task, not a task of its own. The printer stays a note until " +
    "somebody makes it something."));

  box.append(lab("A book, read the same way - and one line in it that turns out to be work:"));
  box.append(ex([
    "Deep Work, ch. 2 [[z/Deep Work]]",
    "  attention residue: the cost is switching, not the length of the switch",
    "    so a 10-minute standup can wreck a morning",
    "  shutdown ritual at the end of the day",
    "    <b>[[1/A shutdown ritual that sticks]]</b>",
    "      <b>TODO</b> Write the end-of-day checklist [[c/computer]]",
    "      <b>TODO</b> Try it for one week, then read this page again",
  ]));
  box.append(line(
    "The same two keys, nothing new. The quotes and the thinking stay notes, " +
    "indented under the chapter they came from, and they stay here where you " +
    "can read the day back. The one line you intend to do something about " +
    "becomes a project where it was written, with its first two steps under " +
    "it - and the paragraph that caused it is still above, in the author's " +
    "words rather than your summary of them a week later."));

  box.append(el("div", {style: "display:flex;gap:8px;margin-top:11px;flex-wrap:wrap"},
    el("button", {class: "btn sm ghost", onclick: () => { PREF.set("tip.off.meeting", "1"); render(); }},
      "got it")));
  return box;
}
