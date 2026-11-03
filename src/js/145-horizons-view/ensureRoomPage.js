/* The room's page, made the first time a chore is written to it. */
function ensureRoomPage(ctx) {
  const path = contextPath(ctx);
  if (!getPage(path)) putPage(path, pageTemplateFor("c", ctx));
  return path;
}
