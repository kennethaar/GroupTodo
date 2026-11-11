/* Use server folder on an area's card or the welcome screen (#357): offered
   while a server folder is free and the area is in none. With several free
   it ends in "…" and asks which. after(moved) runs once it is done. */
function useServerFolderButton(name, after, cls = "btn sm ghost") {
  const options = serverFolderOptions();
  if (options.some(o => o.users.some(sp => sp.name === name))) return null;
  const free = options.filter(o => !o.users.length);
  if (!free.length) return null;
  return el("button", {class: cls, onclick: async () => {
    const o = await pickServerFolder(name, free);
    after(o ? await useServerFolder(name, o.base) : false);
  }}, free.length > 1 ? "Use server folder…" : "Use server folder");
}
