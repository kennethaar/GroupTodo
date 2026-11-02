/* A date has nowhere to go, so the menu is the other two. Both dates are
   edited in one place, so "change" is the panel's date fields. */
function clearDates(path, block) {
  for (const k of Object.keys(block.props))
    if (/^(scheduled|deadline|due)$/i.test(k)) delete block.props[k];
  touch(path); render();
  notify("Date cleared.");
}
