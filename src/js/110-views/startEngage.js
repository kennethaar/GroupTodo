/* Focus in Next (#360): only the context's first next action, until Esc. */
function startEngage(ctx) {
  ENGAGE = {ctx, seen: new Set(), skipped: [], done: 0};
  setWritingFocus(true);
  render();
}
