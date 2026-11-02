/* "NOK 3 480,95 spent", and quieter, what the open tasks still say they cost. */
function priceChips(tally) {
  const spent = fmtPrices(tally.spent), planned = fmtPrices(tally.planned);
  return [
    spent ? el("span", {class: "chip", title: "The prices on its done tasks"}, spent + " spent") : null,
    planned ? el("span", {class: "chip age", title: "The prices on its open tasks"}, planned + " planned") : null,
  ];
}
