function macrosIn(title) {
  const out = [];
  for (const m of String(title || "").matchAll(MACRO_RE)) {
    const kind = m[1].toLowerCase(), arg = trim(m[2]);
    if (kind === "query") { out.push({kind, q: arg, raw: m[0]}); continue; }
    const page = /^\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]$/.exec(arg);
    const id = /^\(\(([A-Za-z0-9_-]{4,64})\)\)$/.exec(arg);
    if (page) out.push({kind, page: trim(page[1].split("|")[0]), raw: m[0]});
    else if (id) out.push({kind, id: id[1], raw: m[0]});
  }
  return out;
}
