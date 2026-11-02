/* ---------- a remembered folder whose permission lapsed ----------
   Downloading grouptodo.html again gives you the same app in a new file, and
   the handles it stored are still there -- but a file:// page keeps no
   permission between visits, so the folder reads as "prompt" again. The old
   behaviour fell back to browser storage with a note telling you to reconnect
   it in Vault & sync, which meant walking the folder picker to a folder the
   app already knew. These keep the handle and ask for the click instead. */
const PENDING_GRANT = new Map();        // space name -> FileSystemDirectoryHandle
/* A folder area whose folder this browser no longer has at all: the handle
   is gone, or the browser would not ask for it. Only picking it again helps. */
const LOST_FOLDER = new Set();          // space names
const folderMissing = name => PENDING_GRANT.has(name) || LOST_FOLDER.has(name);
let INIT_DONE = false;

/* ---------- the area on screen without its folder (#164) ----------
   A phone drops the folder's permission each time the app is closed, and the
   area then opened on what browser storage held: an old copy, or next to
   nothing. A person added just before closing looked lost, though the file
   was in the folder all along, and the one dialog that said so was easy to
   wave away. So the area shows this in place of its pages until the folder
   is back, with the tap that brings it back. "Not now" is for somebody who
   really means to use browser storage, for this session only. */
const AWAY_OK = new Set();              // areas used without their folder this session, on purpose
/* Waiting for its folder, and not opened without it on purpose: no day page
   is made until the folder is read. Browser storage holds only what the
   folder has not taken yet, so today's page made from it was its templates
   alone, laid over the day written in the folder (#232). */
const folderWaiting = name => !!name &&
  ((folderMissing(name) && !AWAY_OK.has(name)) || FOLDER_READING.has(name));
const folderAwayShown = () =>
  !!V.space && folderMissing(V.space) && !AWAY_OK.has(V.space) && state.view !== "help";
