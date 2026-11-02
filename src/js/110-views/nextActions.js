/* ============================================================
   NEXT -- on your plate
   ============================================================ */
function nextActions() {
  // A waiting task is no longer counted yours, so one counting down is fetched on its own.
  const lingering = LINGER.size ? leafActions().filter(a => a.state === "WAIT" && LINGER.has(a.block.id)) : [];
  return myOpen().filter(a => a.state !== "WAIT").concat(lingering)
    .filter(a => !a.projectStatusDir || a.projectStatusDir === "1" || a.projectStatusDir === "3");
}
