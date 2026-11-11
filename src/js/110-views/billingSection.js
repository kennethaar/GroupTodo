/* Above the clients' hours, only when there is something: what each client
   has not been billed for, with Bill, and the payments still waited for.
   Work unbilled for over BILL_OLD_DAYS and a payment past its day stand out. */
function billingSection() {
  const today = todayISO(), S = sheetById("clients");
  const owed = unbilledByClient(today), unpaid = unpaidBills();
  if (!owed.length && !unpaid.length) return null;
  const c = el("div", {});
  if (owed.length) c.append(section("Not yet billed", owed.length, el("div", {class: "card"}, ...owed.map(o => {
    const priced = o.lines.filter(l => l.kind === "price").length, old = o.since && o.since < shiftISO(today, -BILL_OLD_DAYS);
    return el("div", {class: "reprow billrow"},
      el("span", {class: "when"}, o.name),
      el("span", {class: "what"}, [o.min ? fmtSheet(S, o.min) : "", priced ? priced + " priced" : ""].filter(Boolean).join(" + "),
        o.since ? el("span", {class: old ? "chip late" : "since"}, "since " + humanDate(o.since)) : null),
      el("span", {class: "marks"}, fmtPrices(o.amount) ? el("span", {class: "chip"}, fmtPrices(o.amount)) : null,
        el("button", {class: "btn sm", onclick: () => openBilling(o.name)}, "Bill")));
  }))));
  if (unpaid.length) c.append(section("Waiting for payment", unpaid.length, el("div", {class: "card"}, ...unpaid.map(w => {
    const late = w.due && w.due < today ? dateDiffDays(w.due, today) : 0;
    return el("button", {class: "reprow", onclick: () => openPageIn(w.space, w.path)},
      el("span", {class: "what"}, plainTitle(w.title)),
      el("span", {class: "marks"}, w.due ? el("span", {class: late ? "chip late" : "chip"},
        late ? late + (late === 1 ? " day late" : " days late") : "due " + w.due) : null));
  }))));
  return c;
}
