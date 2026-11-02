/* Focus the pane on a line, or on its whole page again. A pin keeps the line
   by an id:: written on it, so it is the same line after a reload. */
function focusSide(b) {
  const s = SIDE_SHOWN;
  if (!s) return;
  if (b) b.collapsed = false;
  if (s.pinned) {
    const branch = b ? inSpace(s.space, () => ensureBlockId(s.path, b)) : "";
    setSidePin(Object.assign(sidePin() || {}, {space: s.space, path: s.path, branch, today: !branch && !!sidePin()?.today}));
  } else SIDE_PAGE = Object.assign({}, s, {branch: b ? b.id : ""});
  $("#pagePane").scrollTop = 0;
  render();
}
