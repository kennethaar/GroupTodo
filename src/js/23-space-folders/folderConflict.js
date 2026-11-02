/* Returns {space, how} when this folder cannot be used, else null. */
async function folderConflict(handle, exceptSpace) {
  for (const sp of Spaces.list) {
    if (sp.name === exceptSpace) continue;
    if (sp.kind !== "fs") continue;
    const other = await storedHandle(sp.name);
    if (!other) continue;
    try {
      if (await other.isSameEntry(handle)) return {space: sp.name, how: "same"};
      if (await other.resolve(handle))     return {space: sp.name, how: "inside"};
      if (await handle.resolve(other))     return {space: sp.name, how: "contains"};
    } catch (_) { /* an unreadable handle cannot be proven safe, but nor is it a conflict */ }
  }
  return null;
}
