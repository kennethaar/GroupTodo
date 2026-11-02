function setHelp(on) {
  if (on) tourMarkSeen("keys");
  HELP_SIDE = on ? "page" : null;
  if (on) HELP_HINT_NOW = null;
  else helpMarks(false);
  $("#pagePane").scrollTop = 0;
  drawSidePage();
  helpHintDraw();
}
