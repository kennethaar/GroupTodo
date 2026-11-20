/* #408 Who else is in an area, and on which page. serve.py hears a beat
   every ten seconds and forgets anyone silent for 30 s. A plain folder has
   no server, so each person keeps a small file of their own in .here/,
   written about once a minute: one file each, so two people never write
   the same file and a sync app makes no conflict copies. A dot folder is
   never read as pages. Nothing goes outside the area's own storage. */
const HERE = {others: new Map(), wrote: new Map(), timer: null};
const HERE_BEAT_MS = 10000, HERE_FILE_MS = 60000, HERE_FILE_STALE_MS = 3 * 60000;
// This device, for the area's list: not a person, so one person on two devices is two rows.
const hereId = () => {
  let id = PREF.get("here.id", "");
  if (!/^[a-z0-9]{8,32}$/.test(id)) { id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); PREF.set("here.id", id); }
  return id;
};
const hereName = space => {
  const n = trim(PREF.get("identity:" + space, "") || PREF.get("identity", "") || "");
  return n === NO_NAME ? "" : n;
};
