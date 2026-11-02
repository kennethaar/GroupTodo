/* A nudge whose list lives further down the review: going to the review alone
   does nothing when you are already on it, so it lands on the list itself. */
function goReviewSection(id) {
  go("review", {sub: "steps"});
  requestAnimationFrame(() => {
    const n = document.getElementById("rsec-" + id);
    if (!n) return;
    // A folded headline is opened on the way, and stays open like one you clicked.
    for (let d = n.closest("details"); d; d = d.parentElement.closest("details")) d.open = true;
    for (const d of n.querySelectorAll("details")) d.open = true;
    n.scrollIntoView({block: "start"});
  });
}
