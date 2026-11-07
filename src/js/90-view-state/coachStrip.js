function coachStrip() {
  if (!coachOn()) return null;
  const steps = coachSteps();
  /* Finished when every step it shows is done or crossed off. Closing as soon
     as the three that matter were done took the optional ones with it, so
     ticking one off could make the whole strip vanish (#186). An optional step
     you do not want is crossed off like any other, or ✕ hides the lot. */
  if (steps.every(st => st.done)) {
    PREF.set("coach", "0");
    notify("Getting started is done. Press ? on any screen for help.");
    return null;
  }

  const box = el("div", {class: "coach"});
  box.append(el("div", {class: "coach-head"},
    el("b", {}, "Getting started"),
    el("span", {style: "color:var(--fg3);font-size:12px"},
      steps.filter(st => st.done).length + " of " + steps.length),
    el("button", {class: "iconbtn", title: "Hide this for good",
      onclick: () => { PREF.set("coach", "0"); render(); }}, "\u2715")));
  // Only the step you are actually on explains itself. Three reasons at once is
  // a leaflet, and nobody reads the leaflet.
  const current = steps.find(st => !st.done);
  for (const st of steps) {
    /* The dot is a button, not a bullet, so Enter and Space work (UX-001): a step you did your own way, or do
       not want, is yours to cross off -- and to take back, when crossing it off
       was a mistake. A step that is done by itself (a full name, a folder) has
       nothing to take back; its button below is still there to change it. */
    const byHand = st.done && coachDone(st.k) && !st.auto;
    box.append(el("div", {class: "coach-step" + (st.done ? " done" : "")},
      el("button", {type: "button", class: "coach-dot" + (!st.done || byHand ? " can" : ""), "aria-pressed": String(!!st.done),
        disabled: !st.done || byHand ? null : "",
        "aria-label": (!st.done ? "Cross it off: " : byHand ? "Not done after all: " : "Done: ") + st.label,
        title: !st.done ? "Cross it off" : byHand ? "Not done after all" : "Done",
        onclick: !st.done ? () => { PREF.set("coach." + st.k, "1"); render(); }
               : byHand ? () => { PREF.set("coach." + st.k, ""); render(); } : null},
        st.done ? svgIcon(ICON_CHECK) : null),
      el("div", {},
        el("div", {}, st.label,
          st.optional ? el("span", {class: "chip", style: "margin-left:6px"}, "optional") : null),
        st.hint ? el("div", {style: "color:var(--fg3);font-size:12px"}, st.hint) : null,
        (st === current && st.why) ? el("div", {class: "coach-why"}, st.why) : null),
      // Done or not, the step can be done again: a name to change, a folder to move.
      st.act ? el("button", {class: "btn sm ghost", style: "margin-left:auto",
        onclick: st.act}, st.done ? (st.redo || st.cta || "Open") : (st.cta || "Choose")) : null));
  }
  return box;
}
