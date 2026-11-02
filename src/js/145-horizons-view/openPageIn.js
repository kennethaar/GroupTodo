/* Opening a page from another space switches to it, so the outliner, saves
   and backlinks all operate where that page actually lives. */
function openPageIn(space, path) {
  if (space && space !== Spaces.active) {
    navRecord();
    openSpace(space, {view: "page", pagePath: path}).catch(error => {
      console.error(error);
      notify("Could not open page.", "error");
    });
    return;
  }
  openPage(path);
}
