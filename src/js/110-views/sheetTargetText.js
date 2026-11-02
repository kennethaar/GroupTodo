/* Back to words, Monday first, days in a row with the same value together. */
function sheetTargetText(S, per) {
  const order = [1, 2, 3, 4, 5, 6, 0], parts = [];
  const num = v => +(S.time ? v / 60 : v).toFixed(2);
  for (let i = 0; i < 7;) {
    let j = i;
    while (j < 6 && per[order[j + 1]] === per[order[i]]) j++;
    if (per[order[i]]) parts.push(WEEKDAY_KEYS[order[i]] + (j > i ? "-" + WEEKDAY_KEYS[order[j]] : "") + " " + num(per[order[i]]));
    i = j + 1;
  }
  return parts.join(", ");
}
