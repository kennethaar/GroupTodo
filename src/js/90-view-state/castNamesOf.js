/* A character is also called by the first word of their name, past any
   title: Anna Berg is Anna, Old Tomas is Tomas. A place or a thing only by
   its whole name, or The harbour would be every "The". */
function castNamesOf(name, aliases = [], type = "character") {
  const words = name.split(/\s+/), lead = words.findIndex(w => !NAME_TITLES.has(w.toLowerCase()));
  const first = type === "character" && lead >= 0 && words.length > 1 ? words[lead] : name, out = [];
  for (const n of [name, ...aliases, ...(first !== name && first.length > 2 ? [first] : [])])
    if (n && !out.some(o => o.toLowerCase() === n.toLowerCase())) out.push(n);
  return out;
}
