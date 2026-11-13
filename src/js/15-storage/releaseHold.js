/* You said the folder is meant to be like this: start writing to it. */
async function releaseHold(name) {
  const rec = LOADED.get(name);
  if (!rec) return;
  PREF.set("pagecount:" + name, "0");
  PREF.set("pagecount-pages:" + name, "0");
  if (rec.hold && rec.hold.reason === "missing") {
    // No folder to write to: carry on in this browser, as any area without one does.
    const sp = Spaces.get(name);
    if (sp) { sp.kind = "local"; delete sp.label; await Spaces.save(); }
    rec.backend = await spaceBackend(sp);
  }
  rec.hold = null;
  afterHold(name);
}
