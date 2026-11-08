function setChecklistKind(path, kind) {
  const page = getPage(path); if (!page) return;
  if (kind === "project" || kind === "words") page.props.kind = kind; else delete page.props.kind;
  // A word list belongs to a line start; = (feelings) until you say another (#214).
  if (kind === "words" && !trim(page.props.lines || "")) page.props.lines = "=";
  touch(path);
}
