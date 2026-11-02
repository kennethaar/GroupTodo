function mergeBundle(files) {
  const lastSync = getSetting("last_sync") || "";
  const tomb = tombstones();
  const report = {added: 0, updated: 0, merged: 0, kept: 0, conflicts: 0, deleted: 0};

  for (const [path, text] of files) {
    const incoming = parsePage(text);

    if (path === SETTINGS_PATH) { mergeSettings(incoming); continue; }

    // A delete on this device beats an older copy arriving from the other one.
    const tombAt = tomb.get(path);
    if (tombAt && tombAt >= (incoming.props?.updated || "")) { report.deleted++; continue; }

    const local = V.pages.get(path);
    if (!local) { putPage(path, incoming); report.added++; continue; }

    const li = local.props?.updated || "";
    const ii = incoming.props?.updated || "";
    const localChanged    = !lastSync || li > lastSync;
    const incomingChanged = !lastSync || ii > lastSync;

    if (ii <= li && !incomingChanged) { report.kept++; continue; }

    if (localChanged && incomingChanged && serializePage(local) !== serializePage(incoming)) {
      const merged = mergePageContents(local, incoming, ii > li);
      putPage(path, isJournalPath(path) ? calMergeDeleted(merged, local, incoming) : merged);
      report.merged++;
    } else if (ii > li) {
      putPage(path, incoming);
      report.updated++;
    } else {
      report.kept++;
    }
  }

  // Tombstones from the other device remove pages still present here.
  for (const [path, at] of tombstones()) {
    const local = V.pages.get(path);
    if (local && (local.props?.updated || "") <= at) {
      V.pages.delete(path);
      V.dirty.delete(path);
      V.removed.add(path);
      report.deleted++;
    }
  }

  setSetting("last_sync", nowStamp());
  scanVerbs();
  return report;
}
