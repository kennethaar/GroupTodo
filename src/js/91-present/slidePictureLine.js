/* A line that is a picture and nothing else (#464): under a bullet, it is
   that bullet's picture, not a line of its own. Its picture, or "". */
function slidePictureLine(b) {
  if (!b || (b.children || []).length) return "";
  const title = b.title || "";
  const src = slidePicture(title);
  return src && !trim(title.replace(DECK_IMAGE_RE, "")) ? src : "";
}
