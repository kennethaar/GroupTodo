function workdayNudge() {
  const wh = workHours();
  if (wh.assumed || !wh.days.includes(weekdayOf(todayISO()))) return;
  const phone = phoneLike();
  if (!phone && touchFirst() && onFolderNow()) return;    // a phone on a folder moves no file
  if (!phone && carriedBySync()) return;
  const at = phone ? wh.end : wh.start;
  const left = hmMinutes(at) - hmMinutes(nowHM());
  if (left > 30 || left < -30) return;
  const key = todayISO() + (phone ? "end" : "start") + (Spaces.active || "");
  if (WORKDAY_SAID === key || PREF.get("workday.said", "") === key || importedToday()) return;
  WORKDAY_SAID = key;
  PREF.set("workday.said", key);
  const linked = !phone && CAP.savePicker && !!LINKED;
  const t = el("div", {class: "toast reminder remind", role: "alert"},
    el("strong", {}, phone ? "End of the workday: bring the PC's file onto your phone"
                           : "Start of the workday: bring in what you did on your phone"),
    el("p", {}, phone
      ? "Work ends at " + wh.end + ". Open the vault file the PC wrote, and the day's work comes home with you."
      : "Work starts at " + wh.start + ". If you worked on your phone, open the file it sent and it merges in."));
  const shut = () => t.remove();
  const act = (cls, label, run) => el("button", {class: "btn sm " + cls, onclick: () => { shut(); run(); }}, label);
  t.append(el("div", {class: "acts"},
    linked ? act("primary", "Sync now", () => syncLinked()) : act("primary", "Open vault file", () => openBundleFromFile()),
    act("ghost", "Not today", () => {}),
    onFolderNow() ? act("ghost", "The folder syncs itself", () => {
      PREF.set("sync.carried", "1");
      notify("No more of these. The sync app carries the folder.");
    }) : null));
  $("#toasts").append(t);
}
