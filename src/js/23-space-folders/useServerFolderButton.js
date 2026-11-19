/* Use server folder on an area's card or the welcome screen (#357): offered
   while a server folder is free. An area already in one is offered the
   others, since a folder that turns out to be the wrong one has to be
   swappable without the browser's folder picker (#432); the folder it lives
   in is not free, so it is never offered back. With several free it ends in
   "…" and asks which. after(moved) runs once it is done. */
function useServerFolderButton(name, after, cls = "btn sm ghost") {
  const free = serverFolderOptions().filter(o => !o.users.length);
  if (!free.length) return null;
  return el("button", {class: cls, onclick: async () => {
    const o = await pickServerFolder(name, free);
    after(o ? await useServerFolder(name, o.base) : false);
  }}, free.length > 1 ? "Use server folder…" : "Use server folder");
}
