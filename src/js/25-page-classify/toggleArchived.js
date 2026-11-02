function toggleArchived(path) {
  const page = getPage(path);
  if (!page) return;
  const props = page.props || (page.props = {});
  const was = isArchived(path);
  if (was) delete props.archived; else props.archived = "true";
  touch(path); render();
  notify(was ? pageTitle(path) + " is back: its tasks count again."
             : pageTitle(path) + " is archived. Its tasks are out of the lists; search still finds it, last.");
}
