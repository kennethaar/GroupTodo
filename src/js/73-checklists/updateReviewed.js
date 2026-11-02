function updateReviewed(path) {
  const page = getPage(path); if (!page) return;
  runTemplateRules(page,"review",null);
  touch(path);
  notify("Review rules applied");
}
