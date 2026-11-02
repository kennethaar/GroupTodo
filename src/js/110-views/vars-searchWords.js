/* ---------- matching a search ----------
   Every word you type has to be there, in any order, and the hits are ranked
   rather than listed in file order. A whole word scores highest, the start of
   a word next ("plumb" finds "plumber"), anywhere inside a word after that,
   and last a word one letter off -- two for long words -- so "elektrikr" still
   finds "elektriker". A page's own name counts double, since a search that
   matches a name is usually looking for that page. Archived pages go last. */
const searchWords = text => String(text || "").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
