function runTemplateRules(item,event,value,vars={}) {
  const props=item.props || (item.props={});
  for (const rule of templateRulesOf(item)) {
    if (rule.event!==event) continue;
    if (event==="status" && (rule.op==="!=" ? value===rule.value : value!==rule.value)) continue;
    const key=Object.keys(props).find(k=>k.toLowerCase()===rule.field.toLowerCase()) || rule.field;
    if (!rule.overwrite && props[key]!=null && String(props[key]).trim()!=="") continue;
    props[key]=expandVars(rule.expression,{title:item.title || props.title || "",...vars});
  }
}
