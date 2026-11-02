function contextIcon(name) {
  return memo("ctxIcon:" + name, () => {
    let icon = "";
    acrossSpaces(() => { const v = getPage(join(DIRS.contexts, name + ".md"))?.props?.icon; if (v && !icon) icon = trim(v); return []; });
    return icon;
  });
}
