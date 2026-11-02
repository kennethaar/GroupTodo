/* ---------- pictures in the vault file ----------
   A phone has no folder to put a photo in, only its own browser storage, so
   a vault file of words alone left the picture behind and the computer drew a
   broken image. So the pictures the pages link to ride along, base64 below the
   pages, each in its own fenced section an older copy of the app skips over.
   From a phone that is every picture: the phone may be the only place one is.
   From a computer it is the last month's, because the computer keeps its
   files in a folder that outlasts the browser, and years of pictures in every
   sync would make a file nobody wants to send. */
const BUNDLE_ASSET_DAYS = 31;
const ASSET_B64 = new Map();         // space|path -> base64, so each sync encodes a picture once
const onPhone = () => /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || "");
