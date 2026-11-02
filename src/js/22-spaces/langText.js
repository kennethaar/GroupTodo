function langText(node) {
  const was = LANG.shown.get(node), now = node.nodeValue;
  if (was && now === was[1]) return;              // ours, already translated
  const t = langLookup(now);
  if (t == null || t === now) { LANG.shown.delete(node); return; }
  LANG.shown.set(node, [now, t]);
  node.nodeValue = t;
}
