/* Every template that applies to the day, poured in: the general ones' lines
   first, the most specific last; on a clashing field the most specific wins,
   and it is the one the page records it came from. A template's own name and
   dates -- title:: 2026-Monday, when it was made and last edited -- are about
   the template, not the day, and stay behind unless written as %placeholders%. */
function pourDayTemplates(date, tpls = resolveTemplates({date, kind: "journals"})) {
  const page = {props: {title: date, created: "[[" + date + "]]"}, blocks: []};
  for (const tpl of tpls.slice().reverse()) {
    const own = getPage(tpl.path).props || {};
    const part = instantiateTemplate(tpl.path, {title: date, date, created: "[[" + date + "]]"});
    for (const k of Object.keys(part.props))
      if (/^(title|created|updated|updated_by)$/i.test(k) && !/%/.test(String(own[k] ?? ""))) delete part.props[k];
    Object.assign(page.props, part.props);
    page.blocks.push(...part.blocks);
  }
  hoistDayTrackers(page);
  return page;
}
