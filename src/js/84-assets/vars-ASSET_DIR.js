/* ============================================================
   84_ASSETS -- the files you drag in
   A note is not always words. Drop a screenshot on a line, or paste one out of
   the clipboard, and the file is written into assets/ inside the very folder
   the markdown lives in -- where Logseq and Obsidian keep theirs -- and the
   line gets an ordinary markdown link to it. Nothing is uploaded anywhere, and
   the folder you share now carries the picture along with the task.
   ============================================================ */
const ASSET_DIR = "assets";
const ASSET_URLS = new Map();          // space|path -> object URL, for this page's life
const ASSET_IMAGE_RE = /\.(png|jpe?g|gif|webp|avif|bmp|svg|ico|heic)$/i;
const assetMax = () => (V.backend && V.backend.kind === "http" ? 8 : 20) * 1024 * 1024;
const isAssetPath = path => /^assets\//i.test(String(path || ""));
const canKeepFiles = () => !!(V.backend && typeof V.backend.putAsset === "function");
