/* "Work-d0n86bq4" back into area and id. An area name can have a hyphen in it,
   and so can an id from elsewhere, so a known area name at the front wins and
   the last hyphen is only the fallback. */
function splitReplyRef(ref) {
  ref = trim(ref);
  const area = Spaces.list.map(s => s.name)
    .filter(n => ref.startsWith(n + "-"))
    .sort((a, b) => b.length - a.length)[0];
  if (area) return {space: area, id: ref.slice(area.length + 1)};
  const cut = ref.lastIndexOf("-");
  return cut > 0 ? {space: ref.slice(0, cut), id: ref.slice(cut + 1)} : {space: "", id: ref};
}
