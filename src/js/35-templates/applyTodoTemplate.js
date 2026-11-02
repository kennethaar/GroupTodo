function applyTodoTemplate(block) {
  if (!TEMPLATE_ENGINE_READY || TEMPLATE_COPYING || !block?.state || TEMPLATE_APPLIED.has(block) || block.props?.template_source) return block;
  const path=requireTemplate("todo");
  if (!path) return block;
  TEMPLATE_APPLIED.add(block);
  const tpl=instantiateTemplate(path,{title:block.title,state:block.state,created:todayStamp()});
  block.props=block.props || {};
  for (const [k,v] of Object.entries(tpl.props)) {
    if (k==="title" || k==="status" || /^(template_|feature_)/i.test(k)) continue;
    const key=Object.keys(block.props).find(x=>x.toLowerCase()===k.toLowerCase()) || k;
    if (block.props[key]==null || String(block.props[key]).trim()==="") block.props[key]=v;
  }
  if (tpl.blocks.length) block.children=(block.children || []).concat(tpl.blocks);
  runTemplateRules(block,"status",block.state);
  return block;
}
