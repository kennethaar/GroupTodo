function blockProp(b, key) {
  if (!b || !b.props) return null;
  const k = Object.keys(b.props).find(x => x.toLowerCase() === key.toLowerCase());
  return k ? b.props[k] : null;
}
