function setToldOn(path, to, stamp) {
  const page = getPage(path);
  if (!page) return;
  const map = toldMap(path);
  for (const ref of [...map.keys()]) if (sameStake({name: ref.slice(2), org: /^o\//i.test(ref)}, to)) map.delete(ref);
  map.set(stakeRef(to), stamp);
  page.props[TOLD_PROP] = [...map].map(([ref, at]) => "[[" + ref + "]] " + at).join(", ");
  touch(path);
}
