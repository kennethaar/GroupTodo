/* One area's widget files brought up to date: ticks read back first when
   asked, then each file written only when its lines changed, and the files of
   contexts that are gone taken away. Not while the area's pages are still
   coming in: what is not read yet would look done or gone; "later" then,
   to be tried again. Each run that changes something is in the Save log (#474). */
async function syncWidgets(rec, {read = false, backend = rec && rec.backend} = {}) {
  if (!rec || !backend || !/^(fs|http)$/.test(backend.kind || "") || rec.hold) return;
  if (!visibleSpaces().includes(rec.name)) return;
  if (areaComingIn(rec.name)) {
    if (!rec.widgetWaitSaid) { rec.widgetWaitSaid = true; appLog("widgets of " + rec.name + ": waiting until all its pages are in"); }
    return "later";
  }
  if (!WIDGET_SEEN.has(backend)) WIDGET_SEEN.set(backend, new Map());
  const seen = WIDGET_SEEN.get(backend);
  const look = async p => {
    if (!seen.has(p)) { let t = null; try { t = await backend.readText(p); } catch (_) {} seen.set(p, t); }
    return seen.get(p);
  };
  if (read) {
    const n = await applyWidgetTicks(rec, backend, seen);
    if (n) appLog("widgets of " + rec.name + ": " + n + " ticked in a widget, marked done");
    if (n) {
      notify(n === 1 ? "1 line ticked in a widget is done here too." : n + " lines ticked in a widget are done here too.");
      scheduleFlush();
      if (rec.name === V.space) renderUnlessTyping();
    }
  }
  const {files, ids} = inSpace(rec.name, () => widgetFiles(rec));
  let before = {};
  try { before = JSON.parse((await look(WIDGET_IDS)) || "{}"); } catch (_) { before = {}; }
  let wrote = 0, gone = 0;
  for (const [file, text] of files) {
    if ((await look(file)) === text) continue;
    await backend.write(file, text);
    seen.set(file, text);
    wrote++;
  }
  for (const file of Object.keys(before)) {
    if (files.has(file) || !isWidgetPath(file)) continue;
    try { await backend.remove(file); gone++; } catch (_) {}
    seen.delete(file);
  }
  if (wrote || gone) appLog("widgets of " + rec.name + ": " + wrote + " of " + files.size + " files written to " + WIDGET_DIR + "/" +
    (gone ? ", " + gone + " of contexts gone taken away" : ""));
  const idsText = JSON.stringify(ids, null, 1) + "\n";
  if ((await look(WIDGET_IDS)) !== idsText) { await backend.write(WIDGET_IDS, idsText); seen.set(WIDGET_IDS, idsText); }
}
