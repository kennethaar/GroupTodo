function templateFeature(item,key) {
  const own=item.props?.["feature_"+key];
  const value=own!=null && String(own).trim()!=="" ? own : V.pages.get(templateOf(item))?.props?.["feature_"+key];
  return /^(true|yes|1)$/i.test(String(value || ""));
}
