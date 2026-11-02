/* ---------- which spaces are on screen right now ----------
   The active space is where new things land; any number of others can be
   shown alongside it. Toggling is per device, never written into a space,
   so nothing about your other lives travels inside a shared folder. */
/* Which spaces are on screen is entirely your choice -- including hiding the
   one you are capturing into. The only rule is that at least one is shown, and
   that the active space is always one of the shown ones (untick it and the
   active role moves to another visible space). */
function storedVisible() {
  let names = [];
  try { names = JSON.parse(PREF.get("visibleSpaces") || "[]"); } catch (_) {}
  // Always in the order of the areas list, never the order they were ticked on.
  const at = n => Spaces.list.findIndex(s => s.name === n);
  return names.filter(n => Spaces.get(n)).sort((a, b) => at(a) - at(b));
}
