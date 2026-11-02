/* What a line's macros show, drawn under it. `seen` holds the pages and lines
   already on the way down, so a page that embeds itself, or two pages that
   embed each other, stop instead of going round for ever. */
const EMBED_MAX_DEPTH = 3;
const EMBED_MAX_LINES = 400;
