function printChores(rows, rooms, roomOf, nameOf, picked) {
  if (!rows.length) { notify("Nothing is due now or this week, so there is nothing to print."); return; }
  printSheet(choreSheet(rows, rooms, roomOf, nameOf, picked, PREF.get("chores.group", "")));
}
