function reminderToast(e) {
  const task = e.kind === "task";
  const t = el("div", {class: "toast reminder remind", role: "alert"},
    el("strong", {}, (task ? "\u{1F552} " : "\u{1F382} ") + e.title),
    el("p", {}, task ? humanWhen(e.day, e.time) + " \u00B7 " + whenUntilWords(e.day, e.time) : "Birthday today."));
  const shut = () => t.remove();
  const act = (cls, label, run) => el("button", {class: "btn sm " + cls,
    onclick: () => { shut(); run(); }}, label);
  const acts = el("div", {class: "acts"},
    task ? act("primary", "Open", () => inSpace(e.a.space, () => openTaskDetail(e.a.path, e.a.block, e.a.space)))
         : act("primary", "Open " + e.b.name, () => openPageIn(e.b.space, e.b.path)),
    task ? act("ghost", "In 10 min", () => remindMark(eventKey(e), 10 * 60000)) : null,
    task ? act("ghost", "Done", () => { inSpace(e.a.space, () => setBlockState(e.a.path, e.a.block, "DONE")); render(); }) : null,
    act("ghost", "OK", () => {}));
  if ("Notification" in window && Notification.permission === "default")
    acts.append(el("button", {class: "btn sm ghost", onclick: ev => {
      ev.currentTarget.remove();
      try { Notification.requestPermission(); } catch (_) {}
    }}, "Also when this tab is hidden"));
  t.append(acts);
  // It stays until it is answered: unlike a nudge, this one you asked for.
  $("#toasts").append(t);
  try {
    if (document.hidden && "Notification" in window && Notification.permission === "granted")
      new Notification(e.title, {body: task ? humanWhen(e.day, e.time) : "Birthday today", tag: eventKey(e), icon: "icon.svg"});
  } catch (_) {}
}
