/* A calendar's meetings in a day's page, in time order, in the places
   meetings already have there; the other lines stay where they are. */
function calSortDay(path) {
  const page = getPage(path), at = [], cal = [];
  (page.blocks || []).forEach((b, i) => { if (blockProp(b, "cal_uid")) { at.push(i); cal.push(b); } });
  const sorted = cal.slice().sort((a, b) => (blockProp(a, "time") || "").localeCompare(blockProp(b, "time") || ""));
  if (sorted.every((b, i) => b === cal[i])) return;
  at.forEach((i, k) => { page.blocks[i] = sorted[k]; });
  touchHere(path);
}
