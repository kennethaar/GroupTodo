// other folded into keep: keep's fields win, notes and lines under it are added.
function foldLine(keep, other) {
  if (other.state && (!keep.state || (isClosed(other.state) && !isClosed(keep.state)))) keep.state = other.state;
  keep.props = Object.assign({}, other.props || {}, keep.props || {});
  keep.body = unionLines(keep.body || [], other.body || []);
  keep.children = unionBlocks(keep.children || [], other.children || []);
  if (!(keep.drawers && keep.drawers.length) && other.drawers) keep.drawers = other.drawers;
}
