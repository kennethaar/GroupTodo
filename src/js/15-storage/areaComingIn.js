/* The area's pages are still coming in: its folder waits for its permission
   or is read behind the browser copy, only today's pages are in, or pages
   stand in by name. What is not read yet -- a context, a template -- may be
   in the folder all the same (#475). */
function areaComingIn(name) {
  const rec = LOADED.get(name);
  return folderWaiting(name) || (!!rec && (!!rec.dayOnly || !!rec.stubs));
}
