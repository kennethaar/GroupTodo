/* ---------- creating and sharing ---------- */
async function createSpace(name, kind, color) {
  const clean = trim(name).replace(/[^\w \-]/g, "").slice(0, 40) || "Area";
  if (Spaces.get(clean)) { notify("An area called " + clean + " already exists.", "warn"); return null; }
  const sp = {name: clean, kind: kind || "local"};
  if (normHex(color)) sp.color = normHex(color);   // else Spaces.add takes the next in the cycle
  if (kind === "fs") {
    if (!CAP.dirPicker) { notify("This browser cannot open folders; using browser storage.", "warn"); sp.kind = "local"; }
    else {
      try {
        const opts = {mode: "readwrite", id: "gtd-space-" + clean};
        const near = await storedHandle(Spaces.active).catch(() => null);
        if (near) opts.startIn = near;        // spaces usually live side by side
        const h = await window.showDirectoryPicker(opts);
        const clash = await folderConflict(h, clean);
        if (clash) { notify(conflictMessage(clean, clash), "error"); return null; }
        await IDB.set("kv", "dir:" + clean, h);
        sp.label = h.name;
        sp.askedStorage = true;
      } catch (e) {
        if (e.name === "AbortError") return null;
        notify("Could not open that folder: " + e.message, "error");
        sp.kind = "local";
      }
    }
  }
  await Spaces.add(sp);
  return sp;
}
