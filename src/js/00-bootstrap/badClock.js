/* True, with the field marked and focused, when one of these clock fields
   holds something that is not a time: a save stops there rather than write it. */
function badClock(...ins) {
  for (const i of ins) i.tidy();
  const bad = ins.find(i => i.classList.contains("bad"));
  if (bad) bad.focus();
  return !!bad;
}
