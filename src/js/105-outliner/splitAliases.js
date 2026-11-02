/* ---------- what a page is called for short ----------
   The page keeps the full name and aliases:: says what people actually say:
   aliases:: JS, Johnny on p/John Smith, aliases:: Storebrand on
   o/Storebrand Forsikring AS, aliases:: pc on c/Computer. Any page can have
   them: people, organisations, projects, areas, contexts, notes. Written as a list, Obsidian's way, or one name
   at a time with commas; alias:: works too. Taking an alias from @ writes
   [[p/John Smith][JS]], which reads as JS and still goes to John. */
function splitAliases(value) {
  let v = trim(String(value || ""));
  if (/^\[(?!\[)[\s\S]*\]$/.test(v)) v = v.slice(1, -1);       // [JS, Johnny]
  return v.split(/[,;]/).map(s => trim(trim(s).replace(/^\[\[|\]\]$/g, "").replace(/^["']|["']$/g, "")))
    .filter(Boolean);
}
