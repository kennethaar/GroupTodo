/* Marks the lines billed to a client up to a day: billed:: on each todo and
   priced task it took, and a line on today's journal with the lines under it.
   With wait it is a WAIT for the payment, due after the organisation's
   pay_days:: (14 without), so the open loop shows in Waiting for. */
function markBilled(name, upTo, lines, {wait = false, no = "", days = null} = {}) {
  const amount = {};
  for (const l of lines) {
    for (const [cur, n] of Object.entries(l.amount || {})) amount[cur] = Math.round(((amount[cur] || 0) + n) * 100) / 100;
    for (const t of l.todos) inSpace(t.space, () => {
      setBilledEntry(t.block, name, upTo, l.kind === "price" ? null : t.stamp, l.kind === "price");
      touch(t.path);
    });
  }
  const today = ensureJournal(todayISO()), org = "[[o/" + name + "]]", total = fmtPrices(amount);
  no = trim(no || "");
  const rec = newBlock({state: wait ? "WAIT" : null,
    title: (wait ? "Payment" + (no ? " of " + no : "") + " from " + org : "Billed " + org + (no ? " on " + no : "")) +
      " for work up to " + upTo + (total ? ": " + total : "")}, false);
  if (total) setBlockProp(rec, "payment", total);
  if (wait) setDue(rec, shiftISO(todayISO(), days != null ? days : numIn(orgProp(name, "pay_days")) || 14));
  rec.children = lines.map(l => newBlock({title: billLineText(l)}, false));
  getPage(today).blocks.push(rec);
  touch(today);
  clearMemo();
  return rec;
}
