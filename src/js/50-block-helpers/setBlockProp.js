function setBlockProp(b, key, val) {
  const k = Object.keys(b.props).find(x => x.toLowerCase() === key.toLowerCase());
  b.props[k || key] = val;
}
