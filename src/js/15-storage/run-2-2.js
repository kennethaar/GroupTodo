document.addEventListener("focusout", () => {
  if (!RENDER_OWED) return;
  setTimeout(() => {
    const ed = document.activeElement;
    if (!RENDER_OWED || ed?.isContentEditable || /^(INPUT|TEXTAREA)$/.test(ed?.tagName || "") || SPACE_TRANSITION) return;
    RENDER_OWED = false;
    render();
  }, 0);
});
