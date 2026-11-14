/* The log as a file in Downloads, headed by where each area keeps its pages
   right now. Returns the file's name, so it can be said where it went. */
function saveAppLog(why = "") {
  const now = new Date();
  const name = "grouptodo-log-" + todayISO() + "-" + String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") + ".txt";
  const areas = [...LOADED.values()].map(r => "  " + r.name + ": " + ((r.backend && r.backend.kind) || "none") +
    (r.backend && r.backend.label ? " “" + r.backend.label + "”" : "") + ", " + r.pages.size + " pages, " +
    (r.dirty.size + r.removed.size) + " not saved yet" + (r.offline ? ", offline (" + r.offline + ")" : ""));
  const head = ["GroupToDo " + APP_VERSION + ", log saved " + now.toString(),
    why ? "Why: " + why : null, navigator.userAgent, "Areas:", ...areas, ""].filter(x => x !== null);
  /* First what holds today's page back: each area's start, step by step,
     then where its folder's time went, file by file. Then every step (#181). */
  const names = new Set([...LOAD_STEPS.keys(), ...LOADED.keys()]);
  for (const n of names) {
    const r = LOADED.get(n), start = startupText(n);
    const t = (r && r.backend && r.backend.timing) || READ_TIMING.get(n);
    if (start) head.push(start, "");
    if (t) head.push("Where the time went, last read of “" + n + "”:", readTimingText(t), "");
  }
  head.push("Every step:");
  downloadText(name, head.concat(APP_LOG).join("\n") + "\n", "text/plain");
  return name;
}
