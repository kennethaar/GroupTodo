/* Anybody owing you something you have never asked about, or asked about long
   enough ago that it has gone quiet. */
function updatesWorthAsking() {
  return outsidersOwingMe().filter(p => p.items.some(a => {
    const d = askedDays(a.block);
    return d == null ? (a.age ?? 0) >= CFG.waitFollowUpDays : d >= CFG.waitFollowUpDays;
  }));
}
