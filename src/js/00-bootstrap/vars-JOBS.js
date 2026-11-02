/* ---------- work going on in the background ----------
   Moving or merging a page rewrites the links to it across the vault and then
   writes every file that changed, which on a synced folder takes a while.
   Nothing on screen said so, and it looked stuck. Now a toast in the corner
   carries a bar until the last file is saved. It holds nothing up: you carry
   on elsewhere, and the cross only hides it. A job done inside a quarter of a
   second never shows at all. */
const JOBS = new Set();
