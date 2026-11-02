function projectTemplateLines(title, code = "1") {
  const initial=code==="0"?"DONE":code==="3"?"WAIT":code==="-"?"CANCELLED":"TODO";
  const page=pageFromTemplate(code,title,{status:STATUS_TEXT[code],state:initial});
  runTemplateRules(page,"status",initial);
  return page;
}
