/* #395 reopened: on a computer the tools get a row of their own just above
   the line being written, from where its words start. The line makes room
   with a top margin as tall as the bar (--ebh), so the tools cover no words
   and the words keep the whole width. Placed against the .blk, which the
   line's ☰ and 🔍 are placed against too; kept as the line grows. */
function editBarPlaceInline(bar, line) {
  const blk = line.parentNode, txt = line.querySelector(".txt");
  line.style.setProperty("--ebh", bar.offsetHeight + 4 + "px");
  const lr = line.getBoundingClientRect(), kr = blk.getBoundingClientRect();
  bar.style.top = (lr.top - kr.top - bar.offsetHeight - 2) + "px";
  bar.style.left = Math.max(0, (txt || line).getBoundingClientRect().left - kr.left) + "px";
}
