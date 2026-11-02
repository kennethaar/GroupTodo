function touchLastSeen() {
  const me = whoAmI();
  if (!me || attributionOff()) return;        // a space that records nothing records this too
  const path = personPath(me);
  if (!V.pages.has(path)) return;             // ensureMemberPage makes it; do not fight it
  const page = getPage(path);
  const prev = Date.parse(trim(String(page.props?.[SEEN_PROP] || ""))) || 0;
  if (Date.now() - prev < SEEN_EVERY_MS) return;   // an hour's resolution is plenty
  page.props[SEEN_PROP] = nowStamp();
  putPage(path, page);
}
