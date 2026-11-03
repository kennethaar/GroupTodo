function setBookInfo({name, subtitle, synopsis}) {
  const page = bookPage();
  page.props.title = oneLine(name) || "book";
  for (const [k, v] of [["subtitle", subtitle], ["synopsis", synopsis]])
    if (oneLine(v)) page.props[k] = oneLine(v); else delete page.props[k];
  saveBook();
}
