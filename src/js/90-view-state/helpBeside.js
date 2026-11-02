function helpBeside(id) {
  HELP_SIDE = HELP[id] ? id : "page";
  helpMarks(false);
  $("#pagePane").scrollTop = 0;
  drawSidePage();
  helpHintDraw();
}
