/* Move, copy or sync a person's page into target. Resolves true once the
   person is there (or already was), false when nothing was carried. */
async function carryPerson(name, target, from = null) {
  const path = personPath(name);
  if (inSpace(target, () => V.pages.has(path))) { notify(name + " is already in " + target + "."); return true; }
  const home = from && LOADED.has(from) && inSpace(from, () => V.pages.has(path)) ? from
    : [...LOADED.keys()].find(sp => inSpace(sp, () => V.pages.has(path)));
  if (!home) return true;                     // no page anywhere: linking makes one here
  // One question: the transfer itself asks move, copy or sync, and what comes along.
  try { return !!(await transferLinkedPages([{path, from: home}], target, {mode: "sync"})); }
  catch (e) { notify("The transfer did not finish: " + e.message, "error"); return false; }
}
