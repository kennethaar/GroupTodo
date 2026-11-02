/* ---------- bundle format ---------- */
function bundleMarkdown() {
  const out = [
    "<!-- GroupToDo vault bundle. Plain markdown: every page is fenced below,",
    "     and you can edit it in any text editor. Keep this file in a folder",
    "     your devices already sync. -->",
    "<!-- gtd:bundle v1 " + nowStamp() + " -->",
    "",
  ];
  for (const path of Array.from(V.pages.keys()).sort()) {
    out.push("<!-- gtd:file " + path + " -->");
    out.push(serializePage(getPage(path)).replace(/\n$/, ""));
    out.push("<!-- gtd:endfile -->", "");
  }
  return out.join("\n");
}
