/* Machinery an earlier build wrote into every item. Returns true if anything went. */
function stripTemplateMachinery(item, task) {
  const props=item.props;
  if (!props) return false;
  let changed=false;
  if ("template_rules" in props) { delete props.template_rules; changed=true; }
  if (task && props.template_source && props.template_source===readTemplate("todo")) { delete props.template_source; changed=true; }
  const template=V.pages.get(templateOf(item));
  for (const k of Object.keys(props)) {
    if (!/^feature_/i.test(k)) continue;
    const tv=template?.props?.[k] ?? template?.props?.[k.toLowerCase()];
    if (tv!=null && String(tv).trim().toLowerCase()===String(props[k]).trim().toLowerCase()) { delete props[k]; changed=true; }
  }
  return changed;
}
