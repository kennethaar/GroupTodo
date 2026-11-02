/* The card springs back to the mat, or goes into the pill that dealt the next one. */
function solGhostHome(ghost, into) {
  if (!ghost.animate || solReduced()) { ghost.remove(); return; }
  const now = ghost.style.transform;
  if (into) {
    const g = ghost.getBoundingClientRect(), [gx, gy] = solMid(g), [tx, ty] = solMid(into.getBoundingClientRect());
    ghost.animate([{transform: now, opacity: .8}, {transform: now + " translate(" + (tx - gx) / .85 + "px," + (ty - gy) / .85 + "px) scale(.15)", opacity: 0}],
      {duration: 240, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards"}).onfinish = () => ghost.remove();
    return;
  }
  ghost.animate([{transform: now, opacity: .8}, {transform: "translate(0,0) scale(1)", opacity: .25}],
    {duration: 300, easing: "cubic-bezier(.3,1.35,.5,1)", fill: "forwards"}).onfinish = () => ghost.remove();
}
