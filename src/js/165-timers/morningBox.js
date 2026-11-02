function morningBox() {
  if (!morningDue()) return null;
  const begun = PREF.get(MORNING_BEGUN, "") === todayISO();
  return el("div", {class: "news"},
    el("span", {"aria-hidden": "true"}, "\u2600"),
    el("div", {}, el("button", {class: "go", onclick: () => { morningRoutine(); render(); }},
        begun ? "Resume morning review" : "Morning review"),
      begun ? " \u00B7 press Done in it when you are finished" : " \u00B7 five minutes on the stalest projects"),
    el("button", {class: "x", "aria-label": "Not today", title: "Not today", onclick: () => {
      PREF.set(MORNING_KEY, todayISO());
      render();
    }}, "\u2715"));
}
