/* The names Hidden names lists in this area, one a line. */
function askHideNames() {
  const page = V.pages.has(ASK_HIDE_PATH) ? getPage(ASK_HIDE_PATH) : null;
  return (page?.blocks || []).map(b => trim(plainTitle(b.title))).filter(Boolean);
}
