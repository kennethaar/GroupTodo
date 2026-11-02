function ensureDefaultTemplates() {
  for (const name of Object.keys(TEMPLATE_DEFAULTS)) createDefaultTemplate(name);
  for (const name of ["0","2","3","-"]) {
    const path = join(DIRS.lists, name + ".md");
    if (!V.pages.has(path)) {
      const def = TEMPLATE_DEFAULTS["1"];
      putPage(path,{props:{...def.props},blocks:def.lines.map(title=>newBlock({title},false))});
    }
  }
  TEMPLATE_ENGINE_READY = true;
}
