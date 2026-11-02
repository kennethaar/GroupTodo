/* Local mirror. Always written BEFORE the real backend, so a save cannot be
   lost to storage that turns out to be unreachable. How much it keeps depends
   on what the backend is, because the two cases need opposite things.

   A SERVER-backed space keeps a FULL copy. The vault lives on the server, so
   when the server is gone the mirror is the only thing the app can open at
   all. On Android that is the difference between opening to your tasks and
   opening to an empty list.

   A FOLDER-backed space keeps only what the folder has not confirmed yet. It
   needs no second copy -- the folder IS the local one -- and a full copy there
   would actively do harm: a page you deleted in Neovim or Explorer is simply
   missing from the folder, which to a full mirror looks like a page the folder
   has never seen, so the next load would put it back. Holding only
   unconfirmed writes means nothing is resurrected, and work still survives a
   folder that loses permission or gets unplugged mid-session.

   On the way back in, the mirror is merged by updated:: and anything newer
   locally is re-queued upstream. */
const mirrorFor = rec => Backends.idb(rec.name);
const mirrorMode = rec =>
  !rec.backend                  ? "off"
  : rec.backend.kind === "http" ? "full"
  : rec.backend.kind === "fs"   ? "pending"
  : "off";
