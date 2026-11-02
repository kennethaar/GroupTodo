function ensureInformOwn() {
  if (!V.pages.has(INFORM_OWN_PATH)) putPage(INFORM_OWN_PATH, informOwnPage());
  else ownPageTopUp(INFORM_OWN_PATH, INFORM_OWN_PARTS, informOwnPage);
  return INFORM_OWN_PATH;
}
