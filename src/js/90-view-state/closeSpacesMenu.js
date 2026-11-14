function closeSpacesMenu() {
  // Thrown away with the Journal's heading it stood in: back to the bar (#395).
  if (!$("#spop")) journalPaper(false);
  $("#spop").hidden = true;
  $("#spacesBtn").setAttribute("aria-expanded", "false");
}
