// Done with in this pass, and when: the reviewed pile shows the latest first.
function solPassed(r) {
  const ans = solAns(r);
  ans["p" + solPassNo()] = true;
  ans["t" + solPassNo()] = Date.now();
  return ans;
}
