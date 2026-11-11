/* Writes one client's entry in billed:: (see billedEntries), keeping the
   other clients' entries as they are. */
function setBilledEntry(b, name, upTo, min, price) {
  const all = billedEntries(b);
  let e = all.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!e) all.push(e = {name, upTo, min: null, price: false});
  if (upTo > e.upTo) e.upTo = upTo;
  if (min != null) e.min = Math.round(min);
  if (price) e.price = true;
  setBlockProp(b, "billed", all.map(x => x.name + " " + x.upTo +
    (x.min != null ? " " + Math.floor(x.min / 60) + ":" + pad2(x.min % 60) : "") + (x.price ? " price" : "")).join("; "));
}
