function ensureAskOwn() {
  if (!V.pages.has(ASK_OWN_PATH)) putPage(ASK_OWN_PATH, askOwnPage());
  else ownPageTopUp(ASK_OWN_PATH, ASK_OWN_PARTS, askOwnPage);
  return ASK_OWN_PATH;
}
