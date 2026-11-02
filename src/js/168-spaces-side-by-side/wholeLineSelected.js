function wholeLineSelected(target) {
  const sel = window.getSelection();
  return !sel || sel.isCollapsed || trim(sel.toString()) === trim(target.textContent || "");
}
