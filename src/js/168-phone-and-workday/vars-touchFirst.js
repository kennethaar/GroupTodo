/* ============================================================
   168_PHONE_AND_WORKDAY -- the file between phone and PC, and when to move it
   A phone in browser storage has no folder, so its work reaches the PC as one file
   it sends through the Share panel. That press is the whole loop, and it is
   the press people forget, so on a phone it is always in the top bar, with a
   dot on it whenever there is something here the file has not carried yet.

   And the loop has a rhythm: the phone goes home with you, the PC stays at
   work. So the two moments to move the file are around the start and the end
   of the workday, which you set once on your own page as work_hours:: --
   it lives in the vault, so the phone and the PC both know it. Half an hour
   either side of starting, the PC asks for what the phone did; half an hour
   either side of finishing, the phone asks for the PC's file. Once a day,
   and never if you have already brought one in that day.
   ============================================================ */
const touchFirst = () => { try { return matchMedia("(pointer: coarse)").matches; } catch (_) { return false; } };
/* A phone whose area nothing carries to the PC by itself. Chrome on Android
   opens folders since version 132, so the picker no longer tells a phone from
   a PC: a phone on a folder, or with a linked vault file, has no file to send. */
/* A folder area counts while its folder waits for "Allow access" too: a phone
   drops the permission each time the app closes, and what is done meanwhile
   goes up to the folder the moment it is allowed, so there is no file to send. */
const folderKind = k => k === "fs" || k === "http";                  // a server writes a folder too
const onFolderNow = () => !!(V.backend && folderKind(V.backend.kind)) ||
  folderKind(Spaces.get(Spaces.active || "")?.kind);
const phoneLike = () => touchFirst() && !onFolderNow() && !LINKED;

const editKey = () => "edit.at." + (Spaces.active || "");
const sentKey = () => "sent.at." + (Spaces.active || "");
