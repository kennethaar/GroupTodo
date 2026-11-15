/* Scrolls Settings to one of its parts, by its key. The page glides there,
   so the jump is seen, and the part lights up only once the glide is done,
   so it is clear which one it is. The glide is its own, not the browser's
   smooth scroll: that one can be called off by the page and never says when
   it ends, so the light came on before the page had moved. Reduced motion jumps, then
   lights. A later jump calls an earlier one off. */
function settingsShow(part) {
  const sec = $("#set-" + part);
  if (!sec) return;
  $$("#content .setflash").forEach(s => s.classList.remove("setflash"));
  const h = sec.querySelector("h2, h3");
  if (h) { h.tabIndex = -1; h.focus({preventScroll: true}); }
  let box = sec.parentElement;
  while (box && box !== document.body && !(/(auto|scroll)/.test(getComputedStyle(box).overflowY) && box.scrollHeight > box.clientHeight))
    box = box.parentElement;
  if (!box || box === document.body) box = document.scrollingElement;
  const edge = box === document.scrollingElement ? 0 : box.getBoundingClientRect().top;
  const margin = parseFloat(getComputedStyle(sec).scrollMarginTop) || 0;
  const from = box.scrollTop;
  const to = Math.max(0, Math.min(box.scrollHeight - box.clientHeight,
    from + sec.getBoundingClientRect().top - edge - margin));
  const me = settingsShow.at = (settingsShow.at || 0) + 1;
  const light = () => {
    const now = $("#set-" + part);      // found again: a redraw meanwhile makes a new one
    if (!now || me !== settingsShow.at) return;
    $$("#content .setflash").forEach(s => s.classList.remove("setflash"));
    now.classList.add("setflash");
    now.addEventListener("animationend", () => now.classList.remove("setflash"), {once: true});
  };
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const span = Math.abs(to - from);
  if (still || span < 4) { box.scrollTo({top: to, behavior: "instant"}); setTimeout(light, 0); return; }
  /* Eased in and out, alike at both ends (quartic): it starts slowly and
     clearly slows into place. A little longer the further it goes.
     Each step waits for the screen's next frame, so it moves with the
     screen; a timer stands in where frames stop. */
  const ms = Math.min(1100, 520 + span / 5), began = performance.now();
  const ease = t => t < .5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
  const next = () => {
    let done = false;
    const go = () => { if (done) return; done = true; clearTimeout(slow); step(); };
    const slow = setTimeout(go, 50);
    requestAnimationFrame(go);
  };
  const step = () => {
    if (me !== settingsShow.at || state.view !== "checklists") return;
    const t = Math.min(1, (performance.now() - began) / ms);
    box.scrollTo({top: from + (to - from) * ease(t), behavior: "instant"});
    if (t < 1) next(); else light();
  };
  next();
}
