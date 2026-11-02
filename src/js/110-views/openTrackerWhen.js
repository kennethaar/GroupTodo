/* The When button: the schedule as the templates have it, to change. */
function openTrackerWhen(name, fallbackKey) {
  const cur = trackerWhen(name);
  const key = cur.key || fallbackKey;
  const pick = whenPicker(todayISO(), cur.when, {none: true});
  const notes = [];
  if (cur.when && cur.when.mode === "dates")
    notes.push("It is in " + cur.when.dates.length + " single-day template" + (cur.when.dates.length === 1 ? "" : "s") +
      " that do not make a pattern. Picking a schedule here takes it out of them.");
  if (cur.also.length) notes.push("It is also in " + whereWords(cur.also) + ". Saving puts it only on the days picked here.");
  if (cur.other.length) notes.push("It is in " + cur.other.join(", ") + " too, which say something else about the day. Those are left as they are.");
  modal({
    center: true, title: "When is " + trackerTitle(name) + "?", hint: "kept in the journal templates in Settings",
    body: el("div", {}, ...notes.map(t => el("p", {class: "hint"}, t)), pick.node),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const w = pick.value();
        if (w && w.invalid) { notify(w.invalid, "warn"); return; }
        closeModal();
        const r = setTrackerWhen(name, key, w);
        render();
        notify(trackerTitle(name) + ": " + describeWhen(w) + "." +
          (r.names.length ? " In " + whereWords(r.names) + "." : "") +
          (r.added ? " Put on " + r.added + " day" + (r.added === 1 ? "" : "s") + " already made." : "") +
          (r.removed ? " Taken off " + r.removed + " empty day" + (r.removed === 1 ? "" : "s") + "." : ""));
      }}, "Save")],
  });
}
