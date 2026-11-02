function setOrDropProp(b, key, val) {
  b.props = b.props || {};
  const k = Object.keys(b.props).find(x => x.toLowerCase() === key.toLowerCase());
  if (trim(val)) setBlockProp(b, key, val);
  else if (k) delete b.props[k];
}
