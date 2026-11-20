/* The aimed answer, and what lines picked in the day page change (#460):
   an answer for one line at a time is greyed out in its place, so nothing
   moves, and a line above the answers says where they go. */
function clPaint(root = document) {
  const picks = clPicked(CL.shown).length;
  root.querySelectorAll(".clans").forEach((n, i) => {
    n.classList.toggle("on", i === CL.aim);
    n.disabled = picks > 1 && !!CL_ANSWERS[i].one;
  });
  const how = root.querySelector(".clhow");
  if (how) how.textContent = CL_ANSWERS[CL.aim].label + ": " + CL_ANSWERS[CL.aim].how;
  const say = root.querySelector(".clpicked");
  if (!say) return;
  say.hidden = !picks;
  say.firstChild.textContent = picks === 1 ? "1 line picked in the day page: the answer goes to it. "
    : picks + " lines picked in the day page: the answer goes to them. ";
}
