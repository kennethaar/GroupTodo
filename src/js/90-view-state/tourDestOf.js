function tourDestOf(title) {
  const m = TOUR_LINK_RE.exec(title || "");
  return m && tourDest(m[1]) ? m[1] : null;
}
