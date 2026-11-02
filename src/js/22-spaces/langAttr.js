function langAttr(elm, name) {
  const v = elm.getAttribute(name);
  if (v == null) return;
  const all = LANG.attrs.get(elm) || {}, was = all[name];
  if (was && v === was[1]) return;
  const t = langLookup(v);
  if (t == null || t === v) { delete all[name]; return; }
  all[name] = [v, t];
  LANG.attrs.set(elm, all);
  elm.setAttribute(name, t);
}
