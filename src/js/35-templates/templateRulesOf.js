function templateRulesOf(item) {
  const template=V.pages.get(templateOf(item));
  if (!template) { try { return JSON.parse(item.props?.template_rules || "[]"); } catch (_) { return []; } }
  const rules=[];
  walkBlocks(template.blocks,b=>{ const rule=templateRule(b.title); if (rule) rules.push(rule); });
  return rules;
}
