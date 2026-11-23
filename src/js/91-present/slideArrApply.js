/* A slide drawn with its kept places (#487): moved lines and the title
   shifted by their at:: (in % of the slide, so the preview shows them the
   same), and each picture cropped at its focus::. */
function slideArrApply(slide, s) {
  if (!s || !s.path) return;
  const shift = (node, v) => {
    const at = slideXY(v);
    node.style.translate = at ? `${at[0]}cqw ${at[1]}cqh` : "";
  };
  const title = slide.querySelector(".stitle");
  if (title) shift(title, slideArrOwner(s, "title")?.get());
  for (const node of slide.querySelectorAll("[data-bid]")) shift(node, slideArrOwner(s, "line", node.dataset.bid)?.get());
  for (const pic of slide.querySelectorAll(".cover .pic")) {
    const f = slideXY(slideArrOwner(s, "pic", pic.dataset.pic)?.get()), img = pic.querySelector("img");
    if (img) img.style.objectPosition = f ? `${f[0]}% ${f[1]}%` : "";
  }
}
