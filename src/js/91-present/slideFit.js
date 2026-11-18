// Too many words for the screen: the slide's text gets smaller, never cut.
function slideFit(slide) {
  const box = slide.querySelector(".stext");
  let fit = 1;
  box.style.setProperty("--fit", fit);
  while (fit > 0.5 && box.scrollHeight > box.clientHeight + 1) {
    fit = Math.round((fit - 0.1) * 10) / 10;
    box.style.setProperty("--fit", fit);
  }
}
