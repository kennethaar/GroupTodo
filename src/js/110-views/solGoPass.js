/* Deal a pass. An active project with everything this pass asks already
   answered is not dealt; if nothing else is missing either, it is reviewed. */
function solGoPass(n) {
  SOL = {order: null, i: 0, focus: null, more: null, pass: n};
  SOL_KB = null;
  if (n === SD_PASS || n === HD_PASS) { SD.skipped.clear(); SD.keep = null; SD.last = null; }
  if (SOL_PASSES[n].k === "loose") { LOOSE.skipped.clear(); LOOSE.q = ""; }
  if (n && SOL_PASSES[n].steps.length) {
    const asked = new Set(solOrder(n).map(solKey));
    const quiet = visibleProjects("1").filter(r => !asked.has(solKey(r)) && solAns(r).status && solFields().every(f => f.filled(r)));
    for (const r of quiet) solMarkReviewed(r, true);
    if (quiet.length) notify(quiet.length + " project" + (quiet.length > 1 ? "s" : "") + " had nothing left to ask, and are reviewed.");
  }
  render();
}
