/* ---------- the path, for people who share the vault and not a URL ----------
   A link carries the app's own address, which is the right thing to paste when
   everybody opens the same one. Two people on a shared folder -- Syncthing, a
   network drive, a NAS, the same vault on two phones -- have no address in
   common. What they do have is the file: pages/1/Rollup.md names the same page
   on both machines, and in Neovim, Logseq and Obsidian as well.

   So "copy path" copies that, and a path pasted into the search box opens the
   page it names rather than being searched for as words. */
async function copyPathTo(path) {
  return copyOneLine(path, {
    title: "Path to " + pageTitle(path),
    ok: "Path copied. Anyone with the same vault can paste it into their search box.",
    hint: "This is the file inside the vault. Paste it to somebody who shares the " +
          "folder and it opens the same page for them - or type it into Neovim, " +
          "Logseq or Obsidian, which open the very same file.",
  });
}
