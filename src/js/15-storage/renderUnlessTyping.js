function renderUnlessTyping() {
  const ed = document.activeElement;
  if ((ed?.isContentEditable || /^(INPUT|TEXTAREA)$/.test(ed?.tagName || "")) || SPACE_TRANSITION) { RENDER_OWED = true; return; }
  RENDER_OWED = false;
  render();
}
