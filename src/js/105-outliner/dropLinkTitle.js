/* The title offer goes, and a lookup still on its way is ignored (#404). */
function dropLinkTitle() {
  clearTimeout(LINK_TITLE.timer);
  LINK_TITLE.id = null;
  LINK_TITLE.seq++;
  document.querySelectorAll(".linktitle").forEach(x => x.remove());
}
