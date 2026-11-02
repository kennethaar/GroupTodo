function requireTemplate(name) {
  const path = readTemplate(name);
  if (path) { MISSING_TEMPLATE_NOTICES.delete((V.space || "") + ":" + name); return path; }
  const key = (V.space || "") + ":" + name;
  // A folder that came back empty is missing every template; the hold dialog says why.
  if (LOADED.get(V.space)?.hold) return null;
  // Nor is browser storage standing in for a folder short of one: the template is in the folder.
  if (folderMissing(V.space)) return null;
  if (!MISSING_TEMPLATE_NOTICES.has(key)) {
    MISSING_TEMPLATE_NOTICES.add(key);
    const space = V.space;
    notify("Missing 8/" + name + ".md. Create it manually, or create an editable default.", "warn", {
      label:"Create default",run:()=>{
        if (V.space !== space) { notify("Return to the original area to create this template.","warn"); return; }
        const made = createDefaultTemplate(name); MISSING_TEMPLATE_NOTICES.delete(key); openPage(made);
      }
    });
    setTimeout(()=>MISSING_TEMPLATE_NOTICES.delete(key),9000);
  }
  return null;
}
