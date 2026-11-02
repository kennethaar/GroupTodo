/* ---------- Kindle's notes and highlights ----------
   Three ways out of Kindle: the notebook on read.amazon.com ("Yellow
   highlight | Location: 180"), the notebook the app mails you ("Highlight
   (yellow) - Page 12 · Location 180") and My Clippings.txt ("- Your
   Highlight on page 12 | Location 180-182 | Added on ...", each one ended by
   a row of "="). The book and its author come first. Each highlight is a
   line, and a note of your own goes under the highlight it was written at. */
const KINDLE_MARK = /^-?\s*(?:your\s+)?(?:[a-z]+\s+)?(highlight|note|bookmark)\s*(?:\([^)]*\))?\s*(?:[|·:–-]|on\b).*\b(?:page|location|loc)\b/i;
