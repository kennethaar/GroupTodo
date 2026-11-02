/* ============================================================
   23_SPACE_FOLDERS
   Every space gets its own folder, and that is enforced rather than
   advised. Two spaces in one folder would put Work and Private in the
   same place -- share that folder and you share both. One space nested
   inside another is worse still: the outer space walks its whole tree, so
   it would read and sync the inner space's files as if they were its own.

   The File System Access API gives no paths, so identity is tested with
   isSameEntry() and containment with resolve(), which returns the path
   segments when a handle really is a descendant.
   ============================================================ */
async function storedHandle(spaceName) {
  try { return (await IDB.get("kv", "dir:" + spaceName)) || null; } catch (_) { return null; }
}
