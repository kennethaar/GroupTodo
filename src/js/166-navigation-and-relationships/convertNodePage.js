function convertNodePage(r, prefix) {
  const dir = STATUS_DIRS[prefix] || PREFIX_DIR[prefix];
  if (!dir) return;
  const dest = join(dir, baseName(r.path) + ".md");
  inSpace(r.space, () => {
    if (dest !== r.path) moveFile(r.path, dest);
    const p = getPage(dest);
    if (!p) return;
    if (STATUS_DIRS[prefix]) p.props.status = STATUS_TEXT[prefix];
    else delete p.props.status;
    touch(dest);
  });
  state.graphFocus = (r.space || "") + "\u0000" + dest;
  PLEX.cursor = state.graphFocus;
  render();
}
