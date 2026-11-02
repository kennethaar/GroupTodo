function helpMarks(on) {
  HELP_MARKS = !!on;
  if (HELP_MARKS && (!HELP_SIDE || !helpOnScreen(helpPaneTopic()))) HELP_SIDE = "page";
  if (HELP_SIDE) drawSidePage();
  helpMarksDraw();
}
