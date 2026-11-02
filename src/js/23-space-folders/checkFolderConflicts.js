/* Warn if an older setup already has two spaces sharing or nesting. */
async function checkFolderConflicts() {
  const fs = Spaces.list.filter(s => s.kind === "fs");
  for (let i = 0; i < fs.length; i++) {
    const a = await storedHandle(fs[i].name);
    if (!a) continue;
    for (let j = i + 1; j < fs.length; j++) {
      const b = await storedHandle(fs[j].name);
      if (!b) continue;
      try {
        if (await a.isSameEntry(b))
          notify(`${fs[i].name} and ${fs[j].name} share one folder. Give one of them its own.`, "error");
        else if (await a.resolve(b) || await b.resolve(a))
          notify(`${fs[i].name} and ${fs[j].name} are nested folders. One is reading the other's files.`, "error");
      } catch (_) {}
    }
  }
}
