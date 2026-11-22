/* One area's widget files brought up to date: ticks read back first when
   asked, then each file written only when its lines changed, and the files of
   contexts that are gone taken away. Written once the active projects are in:
   on a phone the whole folder took many minutes, or never ended. Until it is
   all in, no file is taken away, and a file holding a tick whose page is not
   read yet is left as it is; "later" then, to be brought up to date again.
   Each run that changes something is in the Save log (#474). */
async function syncWidgets(rec, {read = false, backend = rec && rec.backend} = {}) {
  if (!rec || !backend || !/^(fs|http)$/.test(backend.kind || "") || rec.hold) return;
  if (!visibleSpaces().includes(rec.name)) return;
  const partly = areaComingIn(rec.name);
  if (partly && (folderWaiting(rec.name) || (rec.dayOnly && !rec.activeIn))) {
    if (!rec.widgetWaitSaid) { rec.widgetWaitSaid = true; appLog("widgets of " + rec.name + ": waiting for its active projects"); }
    return "wait";
  }
  if (!WIDGET_SEEN.has(backend)) WIDGET_SEEN.set(backend, new Map());
  const seen = WIDGET_SEEN.get(backend);
  const look = async p => {
    if (!seen.has(p)) { let t = null; try { t = await backend.readText(p); } catch (_) {} seen.set(p, t); }
    return seen.get(p);
  };
  let waiting = new Set();
  if (read || rec.widgetTicksWait) {
    const got = await applyWidgetTicks(rec, backend, seen, partly);
    waiting = got.waiting;
    rec.widgetTicksWait = waiting.size > 0;
    if (got.done) {
      appLog("widgets of " + rec.name + ": " + got.done + " ticked in a widget, marked done");
      notify(got.done === 1 ? "1 line ticked in a widget is done here too." : got.done + " lines ticked in a widget are done here too.");
      scheduleFlush();
      if (rec.name === V.space) renderUnlessTyping();
    }
  }
  const {files, ids} = inSpace(rec.name, () => widgetFiles(rec));
  let before = {};
  try { before = JSON.parse((await look(WIDGET_IDS)) || "{}"); } catch (_) { before = {}; }
  let wrote = 0, gone = 0;
  for (const [file, text] of files) {
    if (waiting.has(file) || (await look(file)) === text) continue;
    await backend.write(file, text);
    seen.set(file, text);
    wrote++;
  }
  if (!partly) for (const file of Object.keys(before)) {
    if (files.has(file) || !isWidgetPath(file)) continue;
    try { await backend.remove(file); gone++; } catch (_) {}
    seen.delete(file);
  }
  if (wrote || gone) appLog("widgets of " + rec.name + ": " + wrote + " of " + files.size + " files written to " + WIDGET_DIR + "/" +
    (gone ? ", " + gone + " of contexts gone taken away" : "") + (partly ? " (more as the folder comes in)" : ""));
  // Kept for what is still to come: a file waiting on a tick, and those of contexts not read yet.
  const keep = {...ids};
  if (partly) for (const [file, rows] of Object.entries(before)) if (!files.has(file) || waiting.has(file)) keep[file] = rows;
  const idsText = JSON.stringify(keep, null, 1) + "\n";
  if ((await look(WIDGET_IDS)) !== idsText) { await backend.write(WIDGET_IDS, idsText); seen.set(WIDGET_IDS, idsText); }
  return partly ? "later" : undefined;
}
