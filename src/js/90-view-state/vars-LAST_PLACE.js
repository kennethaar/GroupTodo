/* Where you left off (#492). LAST_PLACE_OFFER is null once you have gone
   somewhere; from the start until then it is true, or the newest place kept
   in any loaded area's GTD.md (last::), which the Journal offers as
   ▸ Continue. Nothing is kept while it is offered, so landing on the Journal
   does not overwrite the place. The place is written at most every few
   seconds, so a synced folder is not kept busy. */
let LAST_PLACE_OFFER = null, LAST_PLACE_TIMER = 0, LAST_PLACE_SAVED = "";
const LAST_PLACE_EVERY = 5000;
