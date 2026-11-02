/* ---------- pinned pages ----------
   Any page can be pinned to the sidebar from the ⋯ beside its title, as many
   as you like, and they sit under the rest in the order you drag them into.
   Pins are this device's, like the areas you tick: {space, path} each. A pin
   whose page is not there (deleted, or its area not ticked on) is not shown
   but kept, so an undo or ticking the area back brings it back. */
function pins() {
  try { const l = JSON.parse(PREF.get("pins", "[]")); return Array.isArray(l) ? l : []; }
  catch (_) { return []; }
}
