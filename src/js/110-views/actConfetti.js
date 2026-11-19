/* Done already, in Review actions (#442): confetti, and every tenth action
   done this week a big burst. Off when the review's celebration is off. */
function actConfetti() {
  if (PREF.get("review.celebrate", "on") === "off") return;
  const n = [...SOL_ANS.values()].filter(a => a.still === "done").length;
  confetti(n > 0 && n % 10 === 0);
}
