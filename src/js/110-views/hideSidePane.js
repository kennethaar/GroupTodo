function hideSidePane() {
  SIDE_SHOWN = null;
  const pane = $("#pagePane");
  pane.hidden = true;
  delete pane.dataset.help;
  pane.replaceChildren();
  document.body.classList.remove("pane-open");
}
