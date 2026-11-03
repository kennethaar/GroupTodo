function setBookDaily(n) {
  const page = bookPage();
  if (n > 0) page.props.daily = String(n); else delete page.props.daily;
  saveBook();
}
