function setChecklistKind(path, kind) {
  const page = getPage(path); if (!page) return;
  if (kind === "project") page.props.kind = "project"; else delete page.props.kind;
  touch(path);
}
