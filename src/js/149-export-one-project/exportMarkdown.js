function exportMarkdown(paths, {strip = false, fenced = true} = {}) {
  const out = [];
  if (fenced) {
    out.push("<!-- GroupToDo export. Open it with Vault & sync → Open vault file. -->",
             "<!-- gtd:bundle v1 " + nowStamp() + " -->", "");
  }
  for (const path of paths) {
    const page = strip ? stripAttributionFrom(getPage(path)) : getPage(path);
    const text = serializePage(page).replace(/\n$/, "");
    if (fenced) out.push("<!-- gtd:file " + path + " -->", text, "<!-- gtd:endfile -->", "");
    else out.push("## " + pageTitle(path), "", text, "");
  }
  return out.join("\n");
}
