function togglePutBack(path) {
  const page = getPage(path);
  if (!page) return;
  const props = page.props || (page.props = {});
  const was = putsBack(path);
  if (was) delete props.putback; else props.putback = "yes";
  touch(path); render();
  notify(was ? pageTitle(path) + " no longer remembers where refiled lines came from."
             : pageTitle(path) + " now remembers where refiled lines came from, and gets a Put back button.");
}
