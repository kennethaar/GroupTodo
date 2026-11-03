function setBookTarget(n) {
  const page = bookPage();
  if (n > 0) page.props.target = String(n); else delete page.props.target;
  saveBook();
}
