/* The aimed answer, and what lines picked in the day page change (#460):
   an answer for one line at a time is greyed out in its place, so nothing
   moves, and a line above the answers says where they go. */
function clPaint(root = document) {
  const picks = clPicked(CL.shown).length;
  root.querySelectorAll(".clans:not(.clall)").forEach((n, i) => {
    n.classList.toggle("on", i === CL.aim);
    n.disabled = picks > 1 && !!CL_ANSWERS[i].one;
  });
  // The line is 5 and the whole branch 0 (#518).
  root.querySelector(".clcard")?.classList.toggle("on", CL.aim === "line");
  root.querySelector(".clall")?.classList.toggle("on", CL.aim === "all");
  const how = root.querySelector(".clhow");
  if (how) how.textContent = CL.aim === "line" ? "The line: 5 again, or Enter, skips it for now."
    : CL.aim === "all" ? (CL.allAns ? CL.allAns.how : "")
    : CL_ANSWERS[CL.aim].label + ": " + CL_ANSWERS[CL.aim].how;
  const say = root.querySelector(".clpicked");
  if (!say) return;
  say.hidden = !picks;
  say.firstChild.textContent = picks === 1 ? "1 line picked in the day page: the answer goes to it. "
    : picks + " lines picked in the day page: the answer goes to them. ";
}
