/* The window the slides show in (#515): the one still open from the last
   talk, or a new one. It gets the page's styles and theme, so the slides
   look the same as in the tab. null when the browser blocks pop-ups: the
   slides then show in this tab. */
function slidesWinOpen(path) {
  // 1920×1080 where the screen has room, else the largest 16:9 that fits; maximised, the slides fill the screen.
  const k = Math.min(1, (screen.availWidth || 1920) / 1920, (screen.availHeight || 1080) / 1080);
  const size = `width=${Math.round(1920 * k)},height=${Math.round(1080 * k)}`;
  const w = SLIDES_WIN && !SLIDES_WIN.closed ? SLIDES_WIN : window.open("", "gtd-slides", "popup," + size);
  if (!w) { notify("Allow pop-ups for this page to show the slides in a window of their own.", "warn"); return null; }
  SLIDES_WIN = w;
  const d = w.document;
  d.title = "Slides · " + pageTitle(path);
  d.head.replaceChildren(...[...document.querySelectorAll("head style, head link[rel=stylesheet]")].map(n => d.importNode(n, true)));
  for (const {name, value} of document.documentElement.attributes) d.documentElement.setAttribute(name, value);
  for (const {name, value} of document.body.attributes) d.body.setAttribute(name, value);
  d.body.replaceChildren();
  w.focus?.();
  return w;
}
