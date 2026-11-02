/* True when the click was the pick-this-out click rather than the open-it
   click. Ctrl everywhere, cmd as well on a Mac, where ctrl-click is the
   context menu. */
function boardPickClick(e, kind, id) {
  if (!(e.ctrlKey || e.metaKey)) return false;
  e.preventDefault();
  e.stopPropagation();
  boardSelToggle(kind, id);
  return true;
}
