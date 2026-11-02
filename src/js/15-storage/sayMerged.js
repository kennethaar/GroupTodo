function sayMerged(rec, merged) {
  if (!merged.length) return;
  const names = inSpace(rec.name, () => merged.map(x => "“" + pageTitle(x.path) + "”"));
  const clash = merged.some(x => x.clashes);
  notify((names.length === 1 ? names[0] + " was" : names.length + " pages were") +
         " changed on another device too. Both sets of changes are kept." +
         (clash ? " Where both changed the same line, both versions are there: check " +
                  (names.length === 1 ? "it." : names.filter((_, i) => merged[i].clashes).join(", ") + ".") : ""),
         clash ? "warn" : undefined);
}
