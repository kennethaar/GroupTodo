/* The field in Vault & sync: on or off, where it is kept, and the report. */
function usageField(hint, toggle) {
  const box = el("div", {class: "field"}, el("label", {}, "Your use of GroupToDo"));
  const mine = Spaces.list.map(s => s.name).filter(n => LOADED.has(n) && !calAreaShared(n));
  const home = usageHome();
  const where = mine.length
    ? el("select", {"aria-label": "Area the log is kept in", onchange: e => {
        PREF.set(USAGE_HOME_KEY, e.target.value);
        usageWrite();
        notify("Your use of GroupToDo is kept in " + e.target.value + ".");
      }}, ...mine.map(n => el("option", {value: n, selected: n === home || null}, n)))
    : null;
  box.append(
    toggle(usageOn(), "Count which screens I use",
      "On this device: visits, active minutes and clicks per screen, page kind and dialog. Never what you wrote. " +
      "Each finished day goes onto a page in an area only you are in, and leaves it only if you send it.",
      on => {
        PREF.set("usage.off", on ? "" : "1");
        notify(on ? "Counting which screens you use." : "Not counting. What was counted stays until you delete the page.");
      }),
    el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
      where ? el("span", {style: "font-size:13px;color:var(--fg2)"}, "Kept in") : null, where,
      el("button", {class: "btn sm ghost", onclick: () => { closeModal(); openUsageReport(); }}, "See what you use")),
    mine.length ? null : hint("Every area here has other people in it, so the counts stay on this device. " +
      "Make an area that is yours alone and they go there."));
  return box;
}
