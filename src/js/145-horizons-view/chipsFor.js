function chipsFor(a, opts = {}) {
  const out = [];
  if (a.context) out.push(el("span", {class: "chip ctx b",
    title: "@" + a.context + (contextInherited(a.block) ? " - from the line above. Go there, or give this line its own"
                                                        : " - go there, change it, take it off"),
    onclick: e => {e.stopPropagation(); openContextChipMenu(a);}}, "@" + a.context));
  if (a.project) out.push(el("span", {class: "chip proj b", title: a.project + " - open it, move this, take it out",
    onclick: e => {e.stopPropagation(); openProjectChipMenu(a);}}, a.project));
  const w = a.due ? dueWhen(a.block) : null;
  // Under Due today, today goes without saying: only a time or a late day is told.
  if (a.due && !(opts.todayImplied && a.due === todayISO() && !(w && w.time))) {
    const {words, ago} = dueText(a.due, w && w.time, !!OPEN_STATES[a.state]);
    const cls = "when " + (a.due < todayISO() ? "late" : a.due === todayISO() ? "today" : "") + (ago ? " ago" : "");
    out.push(duePill(a, cls, opts.journal && !ago ? dueWords(words) : words));
  }
  if (a.age != null && a.age > 0) out.push(el("span", {class: "chip age when"}, a.age + "d"));
  const fresh = freshnessBar(a);
  if (fresh) out.push(fresh);
  // Only where the list is in that order: the row objects are shared with every other view.
  if (a._showUrgency && (state.view === "next" || state.view === "waiting")) out.push(urgencyChip(a));
  if (a.held) out.push(el("span", {class: "chip b when", title: "Hidden from your lists until then",
    onclick: e => { e.stopPropagation(); chipMenu(holdWords(a.held), "hold", [
      ["a", "Bring it back now", null, () => inSpace(a.space, () => releaseTaskHold(a.path, a.block))],
      ["b", "Change the date", null, () => inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space, "date"))],
    ]); }}, holdArrow(a.held)));
  const msgs = messagesOf(a.block).length;
  if (msgs) {
    const un = unreadCount(a.block);
    out.push(el("span", {class: "chip msg when" + (un ? " b unread" : ""),
      title: un ? un + " you have not read" : msgs + " message(s)"},
      "\u25CB " + (un ? un + " new" : String(msgs))));
  }
  if (messagesOf(a.block).some(flaggedByMe))
    out.push(el("span", {class: "chip flagged when"}, "\u2691"));
  if (a.mention) out.push(el("span", {class: "chip who", title: "Yours to do, and it names " + a.mention +
    ", so it is something to ask them about"}, "to ask " + firstNameOf(a.mention)));
  if (a.assignee) out.push(el("span", {class: "chip who b asg", title: a.assignee + " has it - go there, hand it on, take it back",
    onclick: e => {e.stopPropagation(); openAssigneeChipMenu(a);}}, "\u2192 " + a.assignee));
  if (a.by && a.by !== whoAmI() && !samePerson(a.by, a.assignee))
    out.push(el("span", {class: "chip who"}, a.by));
  /* An hour or more is not done in a gap between other things, so until it
     has a day it asks for one. */
  if (estBand(a.title) === 4 && OPEN_STATES[a.state] && a.state !== "WAIT" && !a.due)
    out.push(el("span", {class: "chip miss b when", title: "An hour or more wants its own slot in the calendar. Click to give it a day.",
      onclick: e => {e.stopPropagation(); inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space, "date"));}}, "book a slot"));
  /* Tidying a task is the weekly review's work, and it lists these same tasks.
     On a list you choose from they are noise, so there they show only on the
     row you point at or are on. */
  const quietChips = gtdQuiet();
  const tidy = "chip miss b" + (state.view === "review" ? "" : " onhover");
  if (a.missingVerb && a.state === "TODO" && !quietChips)
    out.push(el("span", {class: tidy, onclick: e => {e.stopPropagation(); openVerbPicker(a.path, a.block);}}, "no verb"));
  if (a.missingContext && a.state !== "WAIT" && !quietChips)
    out.push(el("span", {class: tidy, title: "Where would you do this? Click to say.",
      onclick: e => {e.stopPropagation(); promptAndInsertContext(a.path, a.block);}}, "no context"));
  return out;
}
