/* The step being asked about: the first sequence not asked yet. */
function actSortNow(r) {
  if (!ACT_SORT || ACT_SORT.key !== actSortKey(r)) ACT_SORT = {key: actSortKey(r), asked: [], past: []};
  return actSortRoots(r).find(b => !ACT_SORT.asked.includes(b.title)) || null;
}
