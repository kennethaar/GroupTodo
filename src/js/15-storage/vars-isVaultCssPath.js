/* ---------- your own stylesheet ----------
   The app keeps its own look plain. Any .css file in pages/8/ of an area is
   laid over it, after the app's own styles so it wins, in file-name order:
   a monospace font, other heading sizes, the first level bold again. The
   app only reads these files, never writes them. Only a chosen folder or the
   sync server can hold one; browser storage has no files of its own. */
const isVaultCssPath = p => p.startsWith(DIRS.lists + "/") && /\.css$/i.test(p);
