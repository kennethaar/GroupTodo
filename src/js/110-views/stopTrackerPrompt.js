function stopTrackerPrompt(name) {
  const tpls = trackerTemplatesWith(name);
  const where = [...new Set(tpls.map(x => baseName(x.p) + (LOADED.size > 1 ? " (" + x.sp + ")" : "")))];
  modal({
    center: true, title: "Stop tracking " + trackerTitle(name) + "?",
    hint: "the days you already filled in are kept",
    body: el("div", {},
      el("p", {}, where.length ? "Takes it out of " + where.join(", ") + " in Settings, so new days do not get it."
        : "No journal template brings it in."),
      el("p", {class: "hint"}, "It is also taken off today and later days where it is still empty.")),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => { closeModal(); stopTracker(name); }}, "Stop tracking")],
  });
}
