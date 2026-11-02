/* ---------- keeping the linked file current without being asked ----------
   The two-device loop is only as good as the moment you remember to press
   Sync, and the press is the part people forget. On a desktop the file handle
   survives restarts, so it can be dropped: merge when the space opens, merge
   when you come back to the tab, and write back once you have stopped typing.

   Three rules keep it from being a nuisance: only when permission is already
   granted -- asking for it needs a click -- never over an edit in progress,
   and quiet unless it actually brought something in from the other device. */
let AUTOSYNC_AT = 0;
let AUTOSYNC_TIMER = null;
const autoSyncOn = () => PREF.get("autosync", "1") === "1";
