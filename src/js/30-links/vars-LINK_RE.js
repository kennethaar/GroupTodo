/* ============================================================
   30_LINKS
   Port of: init.lua 110_WIKI_LINK_OVERRIDE
   ============================================================ */
/* [[target]] or [[target][what it reads as]]. A label is how the link reads
   and never where it goes, so linksIn hands back the target alone. */
const LINK_RE = /\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]/g;
const LINK_PREFIXES = new Set(Object.keys(STATUS_DIRS).concat(Object.keys(PREFIX_DIR)));
