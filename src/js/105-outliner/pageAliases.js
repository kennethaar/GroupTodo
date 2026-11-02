function pageAliases(path) {
  const props = getPage(path)?.props || {};
  const out = [];
  for (const a of [...splitAliases(props.aliases), ...splitAliases(props.alias)])
    if (!out.some(o => o.toLowerCase() === a.toLowerCase())) out.push(a);
  return out;
}
