function serializePage(page) {
  const out = [];
  const props = page.props || {};
  const keys = Object.keys(props);
  if (keys.length) {
    for (const k of keys) out.push(k + ":: " + props[k]);
    out.push("");
  }
  out.push(...serializeBlockLines(page.blocks || [], 0));
  return out.join("\n").replace(/\n+$/, "") + "\n";
}
