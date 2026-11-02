/* Scroll a node to the middle of the screen and mark it for a moment. */
function centerLinkText(n) {
  if (!n || !n.isConnected) return;
  n.scrollIntoView({block: "center", inline: "nearest"});
  n.setAttribute("tabindex", "-1");
  n.focus({preventScroll: true});
  n.classList.add("link-centered");
  setTimeout(() => n.classList.remove("link-centered"), 2000);
}
