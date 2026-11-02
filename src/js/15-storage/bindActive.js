function bindActive(name) {
  const r = LOADED.get(name);
  if (!r) return;
  V.backend = r.backend; V.pages = r.pages; V.raw = r.raw;
  V.dirty = r.dirty; V.removed = r.removed; V.space = name;
  V.loaded = true;
}
