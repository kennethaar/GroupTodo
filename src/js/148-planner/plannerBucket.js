/* The bucket is the client: the one with the largest share when there are
   several, the first named on a tie, suppliers never. */
function plannerBucket(r) {
  const shares = clientShares(r);
  return shares.length ? shares.reduce((best, x) => x.pct > best.pct ? x : best).name : PLANNER_NO_ACCOUNT;
}
