/* The names in a value: [[Anna]], [[p/Anna|Ann]] or Anna, Bo. */
function namesIn(value) {
  const out = [];
  for (const part of String(value || "").split(/[,;](?![^\[]*\]\])/)) {
    const links = linksIn(part).map(l => trim(l.split("][")[0].split("|")[0]));
    out.push(...(links.length ? links : splitAliases(part)));
  }
  return out;
}
