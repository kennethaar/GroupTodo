const queryValueMatch = (have, want) => {
  const norm = v => trim(String(v || "")).toLowerCase().replace(/^#/, "").replace(/\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]/g, "$1");
  const h = norm(have), w = norm(want);
  if (!w) return !!h;
  return h === w || h.split(/\s*,\s*/).includes(w);
};
const pagePropOf = (path, key) => {
  const props = getPage(path)?.props || {};
  const k = Object.keys(props).find(x => x.toLowerCase() === String(key).toLowerCase());
  return k ? props[k] : "";
};
