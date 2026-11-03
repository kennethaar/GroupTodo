/* A task type's path, or "" for the built-in stages. */
function setBookStages(path) {
  const page = bookPage();
  if (path) page.props.stages = "[[" + pageRef(path) + "]]"; else delete page.props.stages;
  saveBook();
}
