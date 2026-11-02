function clearContext() {
  state.context = null;
  state.surfaced = [];
  setSetting("current_context", "");
  renderContextChip();
  render();
  notify("No context. Showing everything again.");
}
