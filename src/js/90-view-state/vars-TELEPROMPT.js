/* Focus as a teleprompter (#324), on a computer only. The line you write in
   stays at the middle of the screen and the text moves past it; scroll, and
   whatever paragraph crosses the middle is the lit one. A phone keeps Focus
   as it was: its screen is too short to give half of it away. */
const TELEPROMPT = {obs: null, raf: 0, glide: 0};
const TP_UNITS = ".outline :is(.txt,.bodyline)";
const tpWanted = () => !matchMedia("(max-width:640px)").matches;
const tpActive = () => document.body.classList.contains("teleprompt");
const tpSoon = () => {
  if (TELEPROMPT.raf) return;
  TELEPROMPT.raf = requestAnimationFrame(() => { TELEPROMPT.raf = 0; tpLight(); });
};
// Where you write: typing, a click, the arrows all move the caret, and the text moves with it.
const tpFollowCaret = () => {
  if (!tpActive()) return;
  const a = document.activeElement;
  if (!a || !a.isContentEditable || !a.matches("#content " + TP_UNITS)) return;
  tpCentre(a);
  tpLight();
};
document.addEventListener("selectionchange", tpFollowCaret);
document.addEventListener("focusin", tpFollowCaret);
// The paragraph you write in has grown: bring its line back to the middle.
document.addEventListener("transitionend", e => { if (e.propertyName === "font-size" && e.target.classList?.contains("tp-lit")) tpFollowCaret(); });
// Your own scrolling wins over a slide still under way.
for (const ev of ["wheel", "pointerdown", "touchstart"]) document.addEventListener(ev, () => {
  if (TELEPROMPT.glide) { cancelAnimationFrame(TELEPROMPT.glide); TELEPROMPT.glide = 0; }
}, {passive: true, capture: true});
document.addEventListener("scroll", e => { if (tpActive() && e.target && e.target.id === "content") tpSoon(); }, true);
// A window made narrow or wide again while in Focus gets what fits it.
matchMedia("(max-width:640px)").addEventListener("change", () => {
  if (document.body.classList.contains("bookfocus")) setWritingFocus(true);
});
