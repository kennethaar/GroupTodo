/* "4 open · 12 done · 2 dropped": the numbers you weigh a project by. */
function projectCountChips(open, tally) {
  return [
    el("span", {class: "chip"}, open + " open"),
    tally.done ? el("span", {class: "chip"}, tally.done + " done") : null,
    tally.dropped ? el("span", {class: "chip", title: "Cancelled, and not counted as done"}, tally.dropped + " dropped") : null,
    ...priceChips(tally),
  ];
}
