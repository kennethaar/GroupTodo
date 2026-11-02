function orgOfBlock(path, block, projectPath) {
  for (let b = block; b; b = b._parent) {
    const o = orgIn([b.title, ...(b.body || [])].join("\n"));
    if (o) return o;
  }
  return orgOfPage(path) || orgOfPage(projectPath) || "";
}
