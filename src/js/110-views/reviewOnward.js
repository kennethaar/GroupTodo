/* From the last projects pass on to the next tab of the review: Reflect when
   it has something to show, or else back to the steps to mark the review done. */
function reviewOnward() {
  const r = reflectWanted();
  return {say: r ? "Next: look back on the week's events and feelings, toward and away." : "Next: mark the review done in Steps.",
    btn: el("button", {class: "btn primary review-onward", onclick: () => go("review", {sub: r ? "reflect" : "steps"})},
      r ? "Reflect ›" : "Steps ›")};
}
