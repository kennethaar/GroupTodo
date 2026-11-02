function dropStakeholder(path, to) {
  const page = getPage(path);
  if (!page) return;
  for (const k of Object.keys(page.props)) {
    if (!STAKE_PROPS.includes(k.toLowerCase())) continue;
    const keep = linksIn(String(page.props[k] || "")).filter(l => {
      const ref = trim(l.split("][")[0]);
      return !sameStake({name: trim(ref.slice(2)), org: /^o\//i.test(ref)}, to);
    });
    if (keep.length) page.props[k] = keep.map(l => "[[" + l + "]]").join(", "); else delete page.props[k];
  }
  touch(path);
}
