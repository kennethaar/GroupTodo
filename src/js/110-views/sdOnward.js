// From the hold cup on to the someday one, once there is nothing left to weigh; after the last, on to the next tab.
function sdOnward() {
  const n = solPassNo() + 1, next = SOL_PASSES[n];
  if (!next) { const o = reviewOnward(); return [el("br"), o.say, el("br"), el("br"), o.btn]; }
  return [el("br"), el("br"), el("button", {class: "btn primary", onclick: () => solGoPass(n)},
    "Deal pass " + (n + 1) + ": " + next.name + " ›")];
}
