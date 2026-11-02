/* Explorer with the page's file selected. The browser may not start Explorer
   itself, so it goes as a line for Win+R: paste it and press Enter. Off
   Windows the plain path is what there is. */
async function revealInExplorer(path, space = V.space) {
  const root = await diskRootOf(space);
  if (!root) return askDiskRoot(space, () => revealInExplorer(path, space));
  const windows = /^[a-z]:|^\\\\/i.test(root);
  const full = windows ? root + "\\" + path.replace(/\//g, "\\") : root + "/" + path;
  if (!windows) return copyText(full, "Path copied: " + full, "Path to " + pageTitle(path));
  return copyText('explorer /select,"' + full + '"',
    "Copied. Press Win+R, then Ctrl+V and Enter: Explorer opens with the file selected.",
    "Paste this into Win+R");
}
