function setProtagonist(entry) {
  const page = bookPage();
  if (entry) page.props.protagonist = "[[" + (entry.path ? pageRef(entry.path) : entry.name) + "]]"; else delete page.props.protagonist;
  saveBook();
}
