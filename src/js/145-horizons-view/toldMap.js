// {ref: stamp} from told::, each link as written
function toldMap(path) {
  const out = new Map(), raw = String(getPage(path)?.props?.[TOLD_PROP] || "");
  for (const m of raw.matchAll(/\[\[([^\]]+)\]\]\s*(\d{4}-\d{2}-\d{2}\S*)/g)) out.set(trim(m[1]), m[2].replace(/[,;]$/, ""));
  return out;
}
