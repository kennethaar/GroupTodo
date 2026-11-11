/* What billed:: on a line says, one entry per client:

     billed:: Acme Ltd 2026-10-31 18:30; Nordlys ApS 2026-09-30 4:15 price

   the day it was billed up to, the client's minutes billed so far, and
   price when its price is billed too. Minutes rather than a day alone, so a
   stretch logged later on a billed day is still there to bill. */
function billedEntries(b) {
  return String(blockProp(b, "billed") || "").split(";").map(trim).filter(Boolean).map(s => {
    const m = /^(.*?)\s+(\d{4}-\d{2}-\d{2})((?:\s+\d+:\d{2})?)((?:\s+price)?)\s*$/i.exec(s);
    if (!m) return null;
    const hm = /(\d+):(\d{2})/.exec(m[3]);
    return {name: trim(m[1]), upTo: m[2], min: hm ? +hm[1] * 60 + +hm[2] : null, price: !!trim(m[4])};
  }).filter(Boolean);
}
