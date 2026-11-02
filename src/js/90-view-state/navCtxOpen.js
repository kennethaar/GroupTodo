/* The contexts, unfolded under Contexts: each one opens Next narrowed to it,
   with what you can do there as its count. Folders of them are indented. */
/* A context with contexts inside it folds them away, folded to start with so a
   long list stays short (#204). The one you are looking at shows anyway. Which
   ones are open is this device's. */
function navCtxOpen() {
  try { const l = JSON.parse(PREF.get("nav.ctxKids", "[]")); return new Set(Array.isArray(l) ? l : []); }
  catch (_) { return new Set(); }
}
