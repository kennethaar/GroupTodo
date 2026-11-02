/* The first of the rest, laid over its stand-ins before the others are read.
   As in readIntoNow, the file wins over what was done to a stand-in, and a
   page made here meanwhile wins over a file not read in before. */
function layInSoon(record, files, edited) {
  let lost = 0;
  for (const [path, text] of files) {
    if (!/\.md$/i.test(path) || isGuidePath(path) || looksLikeBundle(text)) continue;
    const touched = edited.has(path) || record.dirty.has(path) || record.removed.has(path);
    if (record.stubs.has(path)) {
      const page = record.pages.get(path);
      if (touched) {
        if (!page || serializePage(page) !== serializePage(parsePage(""))) lost++;
        edited.delete(path); record.dirty.delete(path); record.removed.delete(path);
      }
      record.stubs.delete(path);
    } else if (touched || record.pages.has(path)) continue;
    record.pages.set(path, parsePage(text));
  }
  lostWhileLoading(record, lost);
}
