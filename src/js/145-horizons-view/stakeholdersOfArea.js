function stakeholdersOfArea(path) {
  const props = getPage(path)?.props || {}, out = [];
  for (const k of Object.keys(props)) {
    if (!STAKE_PROPS.includes(k.toLowerCase())) continue;
    for (const l of linksIn(String(props[k] || ""))) {
      const ref = trim(l.split("][")[0]), org = /^o\//i.test(ref);
      if (!org && !/^p\//i.test(ref)) continue;
      const s = {name: trim(ref.slice(2)), org};
      if (!out.some(x => sameStake(x, s))) out.push(s);
    }
  }
  return out;
}
