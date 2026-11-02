function backfillTemplateFields(item, templatePath, vars = {}, task = false) {
  const template = V.pages.get(templatePath);
  if (!template) return false;
  const props = item.props || (item.props = {});
  const present = new Set(Object.keys(props).map(k => k.toLowerCase()));
  let changed = false;
  for (const [key, value] of Object.entries(template.props || {})) {
    // Rules and feature flags are read from the template when needed, not copied.
    if (/^(template_|feature_)/i.test(key) || (task && /^(title|status)$/i.test(key))) continue;
    // A blank existing field is deliberate and is not a missing field.
    if (present.has(key.toLowerCase())) continue;
    props[key] = expandVars(value, vars);
    present.add(key.toLowerCase()); changed = true;
  }
  // A task's template is implied; a page records which template it came from.
  if (!task && !props.template_source) { props.template_source = templatePath; changed = true; }
  if (!task && orderLikeTemplate(props, template.props || {})) changed = true;
  return changed;
}
