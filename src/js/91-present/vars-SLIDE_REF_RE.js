/* A reference to a line, ((id)), and a line that is only an embed of one,
   {{embed ((id))}}, or of a page, {{embed [[Page]]}} (#470). The line's id
   is group 1, the page's name group 2. */
const SLIDE_REF_RE = /\(\(([A-Za-z0-9_-]{4,64})\)\)/g;
const SLIDE_EMBED_RE = /^\s*\{\{\s*embed\s+(?:\(\(([A-Za-z0-9_-]{4,64})\)\)|\[\[([^\]]+)\]\])\s*\}\}\s*$/i;
