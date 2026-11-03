function paintHeadLine(line, title, isTask) {
  for (let n = 1; n <= 6; n++) line.classList.remove("hd" + n);
  /* An empty note is space between notes, so it goes without its dot (#106).
     "blank", not "empty": .empty is the centred "Nothing here" message. */
  line.classList.toggle("blank", !isTask && !trim(title));
  const n = headLevel(title, isTask);
  if (n) line.classList.add("hd" + n);
  const k = bujoKind(title, isTask);
  line.classList.toggle("ev", k === "ev");
  line.classList.toggle("feel", k === "feel");
  line.classList.toggle("beat", isBeat(title, isTask));
}
