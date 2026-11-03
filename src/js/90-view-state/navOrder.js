function navOrder() {
  const page = getPage(SIDEBAR_PATH);
  if (!page) return navDefaultOrder();
  const out = [];
  let seps = 0;
  for (const b of page.blocks || []) {
    const t = trim(b.title || "");
    if (/^-{3,}$/.test(t)) { if (seps < 2) { out.push(NAV_SEP); seps++; } continue; }
    const id = navIdOf(t);
    if (id && !out.includes(id)) out.push(id);
  }
  while (seps++ < 2) out.push(NAV_SEP);
  // Anything not named goes after the item before it in the built-in order.
  const def = navDefaultOrder();
  def.forEach((id, i) => {
    if (id === NAV_SEP || out.includes(id)) return;
    let at = 0;
    for (let j = i - 1; j >= 0; j--) {
      const k = out.indexOf(def[j]);
      if (def[j] !== NAV_SEP && k >= 0) { at = k + 1; break; }
    }
    out.splice(at, 0, id);
  });
  return out;
}
