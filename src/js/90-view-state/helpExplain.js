/* What number i is: the thing lit up, a line beside it, and the legend row lit. */
function helpExplain(i) {
  const t = HELP[helpPaneTopic() || helpTopicHere()], item = (t.legend || [])[i];
  if (!item) return;
  const n = helpFind(item[0]);
  for (const li of $("#pagePane").querySelectorAll(".helplegend li")) li.classList.toggle("on", li.dataset.n === String(i));
  const row = $("#pagePane").querySelector('.helplegend li[data-n="' + i + '"]');
  if (row) row.scrollIntoView({block: "nearest"});
  if (!n) { notify("That is not on the screen just now."); return; }
  n.scrollIntoView({block: "nearest", inline: "nearest"});
  helpFlash(n, (i + 1) + ". " + item[1]);
}
