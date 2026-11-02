/* What to write in [[ ]] so it finds this page again. The short form is the
   usual one, but a page in a folder of its own (pages/Work/Clients.md) is
   only found by its whole path. */
function linkRefTo(path) {
  const ref = pageRef(path);
  if (findExistingPage(ref) === path || !path.startsWith(PAGES + "/")) return ref;
  return path.slice(PAGES.length + 1).replace(/\.md$/i, "");
}
