/* ---------- a big folder, still coming in ----------
   Under Pages while the rest of a folder is read: a bar and how far it has
   come, so a page not there yet reads as on its way, not lost. Click the bar
   for each file as it comes in. */
const LOADING = new Map();          // area -> {done, total, last}
let LOADING_OPEN = false, LOADING_PAINT = 0;
