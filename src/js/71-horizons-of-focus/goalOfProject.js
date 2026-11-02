function goalOfProject(path) {
  const m = /\[\[g\/([^\]]+)\]\]/.exec(getPage(path)?.props?.goal || "");
  return m ? trim(m[1]) : null;
}
