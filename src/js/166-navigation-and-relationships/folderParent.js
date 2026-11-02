/* A page in a folder named after another (pages/1/Party/Invites.md) is part
   of it: the page by that name beside the folder, or anywhere, and when there
   is none, still the folder itself, by name. */
function folderParent(space, path) {
  return inSpace(space, () => {
    const parts = path.split("/");
    const dir = parts.slice(0, -1).join("/");
    if (parts.length < 3 || dir === PAGES || Object.values(DIRS).includes(dir)) return null;
    const folder = parts[parts.length - 2];
    const beside = parts.slice(0, -2).concat(folder + ".md").join("/");
    if (V.pages.has(beside) && beside !== path) return {path: beside};
    const found = findExistingPage(folder);
    return found && found !== path ? {path: found} : {path: null, title: folder};
  });
}
