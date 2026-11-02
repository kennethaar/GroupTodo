/* The row under a rationed list: one more page, or all of it.
   A cap exists because drawing twenty thousand rows took ten seconds, but
   somebody who actually wants the whole list should not have to press "show
   more" eleven times to get it. `step` draws another page, `all` draws the
   rest; the second button only appears when it would do something the first
   one does not. */
function moreRow(step, all) {
  const stepBtn = el("button", {class: "showmore", onclick: e => { e.stopPropagation(); step(); }});
  const allBtn  = el("button", {class: "showmore all", onclick: e => { e.stopPropagation(); all(); }});
  const row = el("div", {class: "showmorerow"}, stepBtn, allBtn);
  row.set = (stepText, allText) => {
    stepBtn.textContent = stepText;
    allBtn.textContent = allText || "";
    allBtn.hidden = !allText;
  };
  return row;
}
