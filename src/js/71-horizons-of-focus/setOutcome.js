function setOutcome(path, text) {
  const page = getPage(path); if (!page) return;
  page.props.outcome = trim(text);
  // drop a stale placeholder block so the page does not say it twice
  page.blocks = (page.blocks || []).filter(b => !(/^outcome:/i.test(trim(b.title)) && OUTCOME_PLACEHOLDER.test(b.title)));
  touch(path);
}
