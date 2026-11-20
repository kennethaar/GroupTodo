/* A slide's two looks (#431): first its title alone in the middle, the
   picture behind it on the whole screen; from the first bullet on, the
   picture on the left 30% and the title, smaller, at the top right over the
   bullets. The title glides from the one place to the other, in 1 s; true
   when it does, so the first bullet can wait for it. */
function slideLay(slide, laid) {
  const title = slide.querySelector(".stitle");
  const first = !slide.dataset.lay;
  if (!first && slide.classList.contains("intro") === !laid) return false;
  const was = first ? null : title.getBoundingClientRect();
  const big = first ? 0 : parseFloat(getComputedStyle(title).fontSize);
  slide.classList.toggle("intro", !laid);
  slide.dataset.lay = "1";
  slideFit(slide);
  slideEven(slide);
  if (first || matchMedia("(prefers-reduced-motion: reduce)").matches || !title.animate) return false;
  const now = title.getBoundingClientRect(), small = parseFloat(getComputedStyle(title).fontSize);
  if (!now.width || !small) return false;
  title.animate([
    {transformOrigin: "0 0", transform: `translate(${was.left - now.left}px, ${was.top - now.top}px) scale(${big / small})`},
    {transformOrigin: "0 0", transform: "none"}], {duration: 1000, easing: "ease-in-out"});
  return true;
}
