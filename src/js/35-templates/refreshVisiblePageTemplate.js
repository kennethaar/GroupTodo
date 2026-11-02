function refreshVisiblePageTemplate() {
  if (state.view !== 'page' || !state.pagePath) return;
  const page = V.pages.get(state.pagePath);
  if (page) backfillUpdatedTemplates([[state.pagePath,page]]);
}
