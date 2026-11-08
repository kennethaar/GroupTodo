function printChores(rows, rooms, roomOf, nameOf, picked) {
  const range = choreRange(PREF.get("chores.printDays", "week"));
  if (!rows.some(a => choreRoundsIn(a, range.from, range.to).length)) {
    notify("Nothing is due in those days, so there is nothing to print."); return;
  }
  printSheet(choreSheet(rows, rooms, roomOf, nameOf, picked, PREF.get("chores.group", ""), range));
}
