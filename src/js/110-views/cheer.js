/* Confetti for something done, unless celebrations are turned off: Done
   already in Review actions and in Clarify alike (#442). */
function cheer(big = false) {
  if (PREF.get("review.celebrate", "on") === "off") return;
  confetti(big);
}
