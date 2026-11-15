/* Scrolls Settings to one of its parts, by its key. The scroll glides, so the
   jump is seen; once it has come to rest the part lights up a moment, so it
   is clear which one it is. Reduced motion jumps, then lights it up. The rest
   is watched rather than heard: the part has not moved for a few frames (or
   1.5 s have gone), which works whichever box does the scrolling. */
function settingsShow(part) {
  const sec = $("#set-" + part);
  if (!sec) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$("#content .setflash").forEach(s => s.classList.remove("setflash"));
  sec.scrollIntoView({block: "start", behavior: still ? "auto" : "smooth"});
  const h = sec.querySelector("h2, h3");
  if (h) { h.tabIndex = -1; h.focus({preventScroll: true}); }
  const began = performance.now();
  let last = null, calm = 0;
  const watch = () => {
    if (!sec.isConnected) return;
    const top = Math.round(sec.getBoundingClientRect().top);
    calm = top === last ? calm + 1 : 0;
    last = top;
    if (calm < 4 && performance.now() - began < 1500) { requestAnimationFrame(watch); return; }
    $$("#content .setflash").forEach(s => s.classList.remove("setflash"));
    sec.classList.add("setflash");
    sec.addEventListener("animationend", () => sec.classList.remove("setflash"), {once: true});
  };
  requestAnimationFrame(watch);
}
