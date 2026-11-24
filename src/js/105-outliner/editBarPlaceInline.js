/* #395 reopened: on a computer the tools float just above the line being
   written, from where its words start, so the words keep the whole width and
   nothing below moves. A page's first line, or one with no room above it on
   screen, has them just below instead. Placed against the .blk, which the
   line's ☰ and 🔍 are placed against too; kept as the line grows. */
function editBarPlaceInline(bar, line) {
  const blk = line.parentNode, txt = line.querySelector(".txt");
  const lr = line.getBoundingClientRect(), kr = blk.getBoundingClientRect(), main = $("#main");
  const outline = line.closest(".outline");
  const first = outline && outline.querySelector(".blk") === blk;
  const roof = Math.max(0, main ? main.getBoundingClientRect().top : 0);
  const below = !!first || lr.top - bar.offsetHeight - 4 < roof;
  bar.classList.toggle("below", below);
  bar.style.top = (below ? lr.bottom - kr.top + 2 : lr.top - kr.top - bar.offsetHeight - 2) + "px";
  bar.style.left = Math.max(0, (txt || line).getBoundingClientRect().left - kr.left) + "px";
}
