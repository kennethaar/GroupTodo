function deepLink(path, block) {
  const q = new URLSearchParams();
  if (Spaces.active) q.set("s", Spaces.active);
  q.set("p", path);
  if (block) q.set("b", ensureBlockId(path, block));
  return location.href.replace(/#.*$/, "") + "#" + LINK_TAG + "&" + q.toString();
}
