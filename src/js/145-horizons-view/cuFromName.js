// Where the mini review goes back to, by the name it has everywhere (P10).
function cuFromName() {
  const f = CU_RUN ? CU_RUN.from : {};
  return f.view === "page" && f.pagePath ? pageTitle(f.pagePath) : VIEW_TITLE[f.view] || "Back";
}
