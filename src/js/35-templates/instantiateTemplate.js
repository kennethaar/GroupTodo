/* Deep-copy a template page, expanding %vars%. */
function instantiateTemplate(tplPath, vars) {
  const src=getPage(tplPath), clone={props:{},blocks:[]}, rules=[];
  const previous=TEMPLATE_COPYING; TEMPLATE_COPYING=true;
  try {
    for (const [k,v] of Object.entries(src.props || {})) {
      if (!/^template_(source|rules)$/.test(k)) clone.props[k]=expandVars(v,vars);
    }
    const copy=bs=>(bs || []).flatMap(b=>{
      const rule=templateRule(b.title);
      if (rule) { rules.push(rule); return []; }
      if (/^@on\b/.test(trim(b.title))) { notify("Invalid template rule: " + b.title,"warn"); return []; }
      return [newBlock({state:b.state,title:expandVars(b.title,vars),
        props:Object.fromEntries(Object.entries(b.props || {}).map(([k,v])=>[k,expandVars(v,vars)])),
        body:(b.body || []).map(l=>expandVars(l,vars)),children:copy(b.children)},false)];
    });
    clone.blocks=copy(src.blocks);
    clone.props.template_source=tplPath;
    return clone;
  } finally { TEMPLATE_COPYING=previous; if (!previous) walkBlocks(clone.blocks,b=>{ if (b.state) applyTodoTemplate(b); }); }
}
