function hiddenHolder(path) {
  const tpl = getPage(path)?.props?.template_source;
  return tpl && tpl !== path && getPage(tpl) ? tpl : path;
}
