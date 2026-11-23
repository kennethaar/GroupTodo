/* The page's start time (#486), starts:: 13:00, as a moment today; null when
   the page has none. "HH:MM" too, as written, for the band. */
function slideWaitAt(path) {
  const m = SLIDE_WAIT_TIME_RE.exec(trim(getPage(path)?.props?.starts || ""));
  if (!m) return null;
  const at = new Date();
  at.setHours(+m[1], +m[2], 0, 0);
  return {at: at.getTime(), text: (+m[1]) + ":" + m[2]};
}
