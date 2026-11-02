function ensureReviewList() {
  if (!ownReviewList()) putPage(REVIEW_LIST_PATH, reviewListPage());
  return REVIEW_LIST_PATH;
}
