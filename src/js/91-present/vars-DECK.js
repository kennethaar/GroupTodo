/* Present a page as slides (#431). DECK is the presentation under way, or
   null: its steps, where it is, the presenter window and what to give back. */
let DECK = null;
// What the audience never sees on a slide: a picture is the cover, the rest notes.
const DECK_IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)\)/;
