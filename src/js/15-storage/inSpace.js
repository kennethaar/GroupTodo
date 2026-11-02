/* Run fn with V pointing at another loaded space, then put it back. Used both
   to read across spaces and to route an edit to the space that owns it. */
function inSpace(name, fn) {
  if (!name || name === V.space || !LOADED.has(name)) return fn();
  const save = {backend: V.backend, pages: V.pages, raw: V.raw,
                dirty: V.dirty, removed: V.removed, space: V.space};
  const r = LOADED.get(name);
  V.backend = r.backend; V.pages = r.pages; V.raw = r.raw;
  V.dirty = r.dirty; V.removed = r.removed; V.space = name;
  try { return fn(); } finally { Object.assign(V, save); }
}
