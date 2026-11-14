async function readInto(record, {stage = false, onRest = null, onSoon = null} = {}) {
  /* Every page edited while this read runs: dirty when it starts or ends, or
     saved in between (doFlush adds those here). The listing can be older than
     any of them. */
  const edited = new Set(record.dirty);
  (record.readers || (record.readers = new Set())).add(edited);
  const done = () => record.readers.delete(edited);
  if (stage && record.backend && record.backend.names && !record.pages.size) {
    const p = readStaged(record, edited, onRest, onSoon);
    READING.add(p);
    let rest = null;
    try { rest = (await p)?.rest; } finally { READING.delete(p); if (!rest) done(); }
    if (rest) { READING.add(rest); rest.finally(() => { READING.delete(rest); done(); }); }
    return record;
  }
  const t = loadMark("“" + record.name + "”: reading " + ((record.backend && record.backend.kind) || "storage"));
  const p = readIntoNow(record, edited);
  READING.add(p);
  try { return await p; }
  finally { READING.delete(p); done(); loadMark("“" + record.name + "”: " + record.pages.size + " pages read", t); }
}
