if (SIBLINGS) SIBLINGS.onmessage = e => {
  const m = e.data || {};
  if (m.by === WINDOW_ID) return;
  const rec = LOADED.get(m.space);
  if (!rec || !rec.backend || rec.backend.kind !== m.kind) return;
  SIBLING_SEEN.set(m.space, Date.now());
  takeSiblingSaves(rec, Array.isArray(m.wrote) ? m.wrote : [], Array.isArray(m.gone) ? m.gone : []).catch(() => {});
};
