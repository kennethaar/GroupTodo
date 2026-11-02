function actColPaint() {
  for (const li of document.querySelectorAll(".acthome .lsopts li[data-row]"))
    li.classList.toggle("on", +li.dataset.col === ACT_COL.c && +li.dataset.row === ACT_COL.i);
  document.querySelector(".acthome .lsopts li.on")?.scrollIntoView({block: "nearest"});
}
