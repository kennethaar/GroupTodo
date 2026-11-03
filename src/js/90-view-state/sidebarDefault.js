function sidebarDefault() {
  if (!getPage(SIDEBAR_PATH)) return;
  removePage(SIDEBAR_PATH);
  clearMemo();
  render();
  notify("The sidebar is back to the default.");
}
