/* NAV_ITEMS as the page orders it, ready for renderNav. */
function navItems() {
  const hidden = navHidden(), out = [];
  let seps = 0;
  for (const t of navOrder()) {
    if (t === NAV_SEP) {
      if (seps++) out.push("pins", "grow");
      else if (out.length) out.push("sep");
      continue;
    }
    if (!hidden.has(t)) out.push(navEntry(t));
  }
  return out;
}
