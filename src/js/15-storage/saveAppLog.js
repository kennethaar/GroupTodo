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
  // How long each folder's last read took, file by file (#181).
  for (const r of LOADED.values()) if (r.backend && r.backend.timing)
    head.push("Last read of “" + r.name + "”:", readTimingText(r.backend.timing), "");
  downloadText(name, head.concat(APP_LOG).join("\n") + "\n", "text/plain");
  return name;
}
