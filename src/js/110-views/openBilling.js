/* Bill a client: what is not billed up to a day, a line per project and
   priced task to tick, copied for the invoice program and marked billed so
   the next bill starts where this one ended. The invoice itself, with its
   number and VAT, is made in the program that keeps the books. */
function openBilling(name) {
  const today = todayISO(), lastEnd = shiftISO(today.slice(0, 7) + "-01", -1);
  const first = unbilledByClient(today).find(c => c.name === name);
  let upTo = first && first.since && first.since <= lastEnd ? lastEnd : today, c = null;
  const off = new Set();
  const days = numIn(orgProp(name, "pay_days")) || 14;
  const dateIn = el("input", {type: "date", value: upTo, "aria-label": "Up to"});
  const noIn = el("input", {placeholder: "Optional", style: "width:140px", "aria-label": "Invoice no."});
  const waitOn = el("input", {type: "checkbox", checked: ""});
  const daysIn = el("input", {inputmode: "numeric", value: String(days), style: "width:52px", "aria-label": "Days to pay"});
  const table = el("div", {class: "htable-wrap"});
  const chosen = () => c ? c.lines.filter((l, i) => !off.has(i)) : [];
  const totalOf = lines => { const by = {};
    for (const l of lines) for (const [cur, n] of Object.entries(l.amount)) by[cur] = Math.round(((by[cur] || 0) + n) * 100) / 100;
    return fmtPrices(by); };
  const hours = l => l.kind === "time" ? fmtSheet(sheetById("clients"), l.min) : "";
  const draw = () => {
    c = unbilledByClient(upTo).find(x => x.name === name) || null;
    const lines = c ? c.lines : [];
    table.replaceChildren(lines.length ? el("table", {class: "htable billtab"},
      el("thead", {}, el("tr", {}, el("th", {}, ""), el("th", {}, "Line"), el("th", {class: "num"}, "Hours"),
        el("th", {class: "num"}, "Rate"), el("th", {class: "num"}, "Amount"))),
      el("tbody", {}, ...lines.map((l, i) => {
        const tick = el("input", {type: "checkbox", checked: off.has(i) ? null : "", "aria-label": l.title,
          onchange: () => { tick.checked ? off.delete(i) : off.add(i); foot.textContent = totalText(); }});
        return el("tr", {}, el("td", {}, tick), el("td", {}, l.title), el("td", {class: "num"}, hours(l)),
          el("td", {class: "num"}, l.rate ? fmtPrice(l.rate.cur, l.rate.amount) : ""),
          el("td", {class: "num"}, fmtPrices(l.amount) || "-"));
      })))
      : el("div", {class: "hint", style: "padding:8px 12px;text-align:left"}, "Nothing to bill up to this day."));
    foot.textContent = totalText();
  };
  const totalText = () => { const t = totalOf(chosen()), min = chosen().reduce((n, l) => n + (l.min || 0), 0);
    return [min ? fmtSheet(sheetById("clients"), min) : "", t ? t + " excl. VAT" : ""].filter(Boolean).join(" · "); };
  const foot = el("div", {class: "reportsum", style: "justify-content:flex-end;font-weight:600"});
  dateIn.addEventListener("change", () => { if (/^\d{4}-\d{2}-\d{2}$/.test(dateIn.value)) { upTo = dateIn.value; off.clear(); draw(); } });
  const asText = () => [name + ", work up to " + upTo + (trim(noIn.value) ? ", invoice " + trim(noIn.value) : ""),
    ...chosen().map(l => "- " + billLineText(l)), "Total excl. VAT: " + (totalOf(chosen()) || "-")].join("\n");
  const asCells = () => [["Line", "Hours", "Rate", "Amount"].join("\t"),
    ...chosen().map(l => [l.title, hours(l), l.rate ? fmtPrice(l.rate.cur, l.rate.amount) : "", fmtPrices(l.amount)].join("\t")),
    ["Total excl. VAT", "", "", totalOf(chosen())].join("\t")].join("\n");
  const mark = () => {
    const lines = chosen();
    if (!lines.length) return notify("Tick at least one line to bill.", "warn");
    const cells = asCells();
    markBilled(name, upTo, lines, {wait: waitOn.checked, no: noIn.value, days: Math.max(0, Math.round(numIn(daysIn.value) || days))});
    closeModal();
    render();
    copyText(cells, "Marked billed up to " + upTo + " and copied. It pastes into a spreadsheet or invoice program as cells.");
  };
  const field = (label, ...kids) => el("div", {class: "field"}, el("label", {}, label), ...kids);
  draw();
  modal({
    center: true, title: "Bill " + name, hint: "what is not billed yet, for your invoice program",
    body: el("div", {},
      field("Up to", dateIn),
      el("div", {class: "card"}, table, foot),
      field("Invoice no.", noIn),
      el("label", {style: "display:flex;gap:6px;align-items:center;margin-top:10px"}, waitOn,
        "Add a Waiting for the payment, due in ", daysIn, " days")),
    foot: [el("button", {class: "btn ghost", onclick: () => copyText(asText(), "Copied as text.")}, "Copy as text"),
           el("button", {class: "btn ghost", onclick: () => copyText(asCells(), "Copied. It pastes into a spreadsheet as cells.")}, "Copy as cells"),
           el("button", {class: "btn primary", onclick: mark}, "Mark billed and copy")],
  });
}
