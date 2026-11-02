/* The nudges, explained and quietenable in the same breath. A prompt you cannot
   interrogate or turn down is a nag; the only convincing way to show this is not
   one is to put the off switch directly beside the reason. */
function openNudgeExplainer() {
  const all = computeNudges().filter(nd => nd.id !== "clean");
  const body = el("div", {});
  body.append(el("div", {class: "field"},
    el("div", {style: "color:var(--fg2);font-size:13px;line-height:1.55"},
      all.length
        ? "Each of these is your own list telling you something. Open one, or quieten it - " +
          "it comes back after " + CFG.nudgeSnoozeDays + " days, and only if it is still true."
        : "Nothing is nagging. This is the whole of what GroupToDo will ever bring up.")));
  for (const nd of all) {
    const sec = el("div", {class: "dash-sec"});
    sec.append(el("h4", {},
      el("span", {}, (nd.count != null ? nd.count + " " : "") + nd.label),
      el("span", {class: "n"}, nd.level === "danger" ? "worth doing now"
        : nd.level === "warn" ? "worth a look" : "whenever")));
    if (NUDGE_WHY[nd.id]) {
      sec.append(el("div", {style: "padding:2px 16px 4px;color:var(--fg2);font-size:13px;line-height:1.55"},
        NUDGE_WHY[nd.id]));
    }
    sec.append(el("div", {style: "display:flex;gap:6px;padding:6px 16px 10px;flex-wrap:wrap"},
      nd.act ? el("button", {class: "btn sm ghost", onclick: () => { closeModal(); nd.act(); }}, "open") : null,
      el("button", {class: "btn sm ghost", onclick: () => {
        quietNudge(nd.id);
        closeModal(); render(); openNudgeExplainer();
      }}, "quiet for " + CFG.nudgeSnoozeDays + " days")));
    body.append(sec);
  }
  body.append(el("div", {class: "field"},
    el("div", {style: "color:var(--fg3);font-size:12px;line-height:1.5"},
      "Under " + CFG.quietUntilTasks + " open tasks the method ones stay away entirely, at " +
      "most " + CFG.nudgeMax + " are ever on screen, and the first day has no weeding and no " +
      "review nag. None of this is counted, scored or sent anywhere - there is nowhere for " +
      "it to be sent.")));
  modal({
    title: "Why these are here", hint: "nudges, not nags",
    body,
    foot: [
      anyNudgeQuiet() ? el("button", {class: "btn ghost", onclick: () => {
        unquietAllNudges(); closeModal(); render(); notify("All nudges are back.");
      }}, "Bring back the quietened") : null,
      el("button", {class: "btn primary", onclick: closeModal}, "Done"),
    ].filter(Boolean),
  });
}
