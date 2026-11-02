function stagesOf(listPath) {
  const lines = (getPage(listPath)?.blocks || []).filter(b => trim(b.title));
  return lines.map((b, i) => {
    const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(trim(b.title));
    const said = m && STAGE_CORE[trim(m[2]).toLowerCase()];
    const name = trim(said ? m[1] : b.title);
    const core = said || b.state || (i === 0 ? "TODO" : i === lines.length - 1 ? "DONE" : "DOING");
    return {name, core};
  }).filter(s => s.name);
}
