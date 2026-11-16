/* Pick a folder for one space, refusing anything that collides.
   join: picked on the welcome screen, where nothing has been written yet --
   so a folder that already holds a vault is somebody's area being joined,
   not a home for the starter pages.
   invited: they said so, and that settles it even for a folder still empty.
   Resolves to {existing, joined} when the folder was taken, else false.
   Every step goes to the app log: a pick that ends without a folder looked
   exactly like nothing happening, with the area still "browser only" (#419). */
async function assignSpaceFolder(name, {join = false, invited = false, returning = false} = {}) {
  if (!CAP.dirPicker) {
    notify("This browser cannot open folders.", "warn");
    return false;
  }
  const sp = Spaces.get(name);
  if (!sp) return false;
  let handle;
  const prev = PENDING_GRANT.get(name) || await storedHandle(name);
  const opts = {mode: "readwrite", id: "gtd-space-" + name};
  // startIn makes the picker open on the folder this space last used, so
  // even a real re-pick starts where it ended rather than at Documents.
  if (prev) opts.startIn = prev;
  appLog("folder: " + name + " asks the browser for a folder (now " + (sp.kind || "?") +
         (sp.label ? " “" + sp.label + "”" : "") + ", starts in " +
         (prev ? "“" + prev.name + "”" : "the last one used") + ")");
  const asked = Date.now();
  const took = () => ((Date.now() - asked) / 1000).toFixed(1) + " s";
  try {
    // The browser's own dialog only says "where this site can save changes",
    // and a page cannot reword it -- so this says what it is about.
    notify(join ? "Pick the folder your list lives in - a shared one, or a new one of your own."
                : "Pick the folder for " + name + ". The browser asks where this site can save changes: that is this.");
    handle = await window.showDirectoryPicker(opts);
  } catch (e) {
    // A cancel, a folder the browser refuses, and a declined "edit files?" all look alike here.
    appLog("folder: " + name + ": the browser gave no folder after " + took() + " (" +
           ((e && e.name) || "Error") + ": " + ((e && e.message) || e) + ")");
    if (e.name !== "AbortError") notify("Could not open that folder: " + e.message, "error");
    return false;
  }
  appLog("folder: " + name + ": the browser gave “" + handle.name + "” after " + took());
  try {
    return await takeSpaceFolder(name, sp, handle, prev, {join, invited, returning});
  } catch (e) {
    const why = (e && e.message) || String(e);
    appLog("folder: " + name + " stopped taking “" + handle.name + "”: " +
           ((e && e.name) || "Error") + ": " + why + (e && e.stack ? "\n" + String(e.stack).split("\n").slice(1, 4).join("\n") : ""));
    notify("Could not open that folder: " + why, "error");
    return false;
  }
}
