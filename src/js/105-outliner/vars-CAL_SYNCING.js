let CAL_SYNCING = false;
/* An area whose folder still waits for permission, or came back empty, is on
   browser storage for now; meetings written there would go over the folder's
   own day pages once it is back. */
const calNotOnFolder = space => !!space && (folderMissing(space) || !!LOADED.get(space)?.hold);
const calWindow = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return [d.getTime(), d.getTime() + CAL_DAYS_AHEAD * 864e5]; };
const calSummary = s => !s.added && !s.changed && !s.gone ? "Calendars: nothing new."
  : "Calendars: " + [s.added && s.added + " new", s.changed && s.changed + " changed", s.gone && s.gone + " gone"]
    .filter(Boolean).join(", ") + ".";
