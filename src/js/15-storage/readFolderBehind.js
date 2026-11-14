/* "Allow access" on a phone: listing a big folder there can take minutes, and
   one file a sync app has not brought down may never open. Read before the
   screen was drawn, the area sat on "Opening area..." all that time, so the
   copy from browser storage stays on screen, and the folder is read into a
   fresh record behind it, today first. No day page is made from the copy
   meanwhile (folderWaiting). Once today is in, the folder's record takes
   over; anything done to the copy meanwhile was saved to browser storage and
   is merged into the folder's pages, line by line (mergeMirror). */
function readFolderBehind(held, backend) {
  const name = held.name, rec = newRecord(name, backend);
  FOLDER_READING.add(name);
  setSync("sync", "reading the folder...");
  loadStep(name, "reading the folder behind the browser copy", null, held.pages.size + " pages in the copy");
  /* Not under the cursor. The lines on screen belong to the copy's pages
     until the screen is drawn again, which waits while you type, from one
     line on to the next and from page to page. Swapped in sooner, the
     folder's record had none of what was typed after: lost when the
     journal came in (#232). So the copy stays until the typing stops; all
     of it is then saved to browser storage and merged in below.
     It takes over as soon as today's page is in, by its name, before the
     folder is listed: the listing alone took half a minute on a phone (#181). */
  let taking = null;
  /* Ending a line with Enter is a moment too (lineDone): the folder takes
     over at once, before the new line is drawn. The pages on screen, and
     those the copy has not saved yet, are carried over as they are, so the
     lines drawn from them stay theirs. Each one that differs from its file
     is merged with it when saved, nothing of either dropped (#181). */
  const carryOver = kept => {
    for (const [p, page] of kept) {
      const theirs = rec.pages.get(p);
      const same = theirs && serializePage(theirs) === serializePage(page);
      rec.pages.set(p, page);
      if (same) PAGE_SRC.set(page, PAGE_SRC.get(theirs));
      else { if (rec.base) rec.base.delete(p); rec.dirty.add(p); }
    }
  };
  const swap = carry => {
    const kept = new Map();
    if (carry) {
      const shown = [...document.querySelectorAll("[data-path]")]
        .filter(n => (n.dataset.space || V.space) === name).map(n => n.dataset.path);
      for (const p of new Set([...shown, ...held.dirty])) if (held.pages.has(p)) kept.set(p, held.pages.get(p));
    }
    LOADED.set(name, rec);
    FOLDER_READING.delete(name);
    carryOver(kept);
    if (V.space === name) bindActive(name);
    return kept;
  };
  const takeOver = () => taking || (taking = (async () => {
    // What the swap waited for, said in the log: a start in seconds cannot wait on any of it (#181).
    const span = ms => ms < 1000 ? Math.round(ms) + " ms" : (ms / 1000).toFixed(1) + " s";
    const began = performance.now();
    let kept = await new Promise(done => {
      LINE_DONE = () => done(LOADED.get(name) === held ? swap(true) : null);
      untilTypingStops().then(() => { if (LINE_DONE) { LINE_DONE = null; done(false); } });
    });
    const typed = performance.now(), entered = !!kept;
    if (kept === null || (!kept && LOADED.get(name) !== held)) { FOLDER_READING.delete(name); return false; }   // opened again or removed meanwhile
    if (!kept) {
      await flush();                                 // what was done to the copy, into browser storage
      kept = swap(false);
    }
    const saved = performance.now();
    await mergeMirror(rec);
    carryOver(kept);                                 // the lines on screen stay bound to their pages
    reconcileSyncedPages(name);
    if (V.space === name) bindActive(name);
    loadStep(name, "the folder's pages took over from the browser copy", began,
      "waited " + span(typed - began) + " for a line being typed" + (entered ? " (ended with Enter)" : "") +
      ", " + span(saved - typed) + " for saves, " + span(performance.now() - saved) + " to merge the copy in");
    DRAW_NOTE = "the folder's today";
    return true;
  })());
  const drawn = () => {
    if (rec.dirty.size || rec.removed.size) scheduleFlush();
    clearMemo(); scanVerbs();
    renderUnlessTyping();
  };
  const onDay = () => takeOver().then(ok => {
    if (!ok || !rec.dayOnly) return;
    inSpace(name, () => ensureJournal(todayISO()));
    drawn();
  }).catch(() => {});
  readInto(rec, {stage: true, onRest: restLoaded, onSoon: soonLoaded, onDay}).then(async () => {
    if (!(await takeOver())) return;
    if (rec.hold) { showHoldDialog(name); setSync("warn", "not saving - folder looks empty"); }
    else {
      inSpace(name, () => { migrateVault(); ensureJournal(todayISO()); });
      // The whole folder came in while the copy was kept: restLoaded let it be.
      if (!rec.stubs) inSpace(name, () => scheduleTemplateRefresh());
      if (V.space === name) setSync("ok", backend.label);
    }
    drawn();
  }).catch(e => {
    FOLDER_READING.delete(name);
    reportStorageTrouble(rec, e);
    /* The browser copy is no folder: ask for the folder again, so "Allow
       access" can try once more, rather than leave the area on browser
       storage with nothing to say so. */
    if (backend.handle && LOADED.get(name) === held) PENDING_GRANT.set(name, backend.handle);
    setSync("warn", "folder not read");
    renderUnlessTyping();
  });
}
