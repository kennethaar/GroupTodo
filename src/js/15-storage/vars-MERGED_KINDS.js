/* ---------- a file another device changed (#220) ----------
   A folder is read when the area loads, and a sync app such as Syncthing
   brings the other devices' edits in behind the app's back. Saving the page
   held here then put this device's old copy over theirs, and two devices
   saving close together is what makes Syncthing leave a conflict copy.

   So before a page goes to a folder its file is read again. When it is not
   what this device last read or wrote (rec.base), the two are merged line by
   line against that last version, the one both started from: a line added,
   changed or taken out on either side carries over. Where both changed the
   same lines both are kept, this device's first, so nothing is lost. */
/* Browser storage is shared the same way: the installed app and a tab open on
   the same site are two windows on one store, and the one left open with an
   old copy put it over what the other had just saved (#233). */
const MERGED_KINDS = new Set(["fs", "idb", "ls"]);
const noteBase = (rec, path, text) => {
  if (rec && rec.backend && MERGED_KINDS.has(rec.backend.kind)) (rec.base || (rec.base = new Map())).set(path, text);
};
