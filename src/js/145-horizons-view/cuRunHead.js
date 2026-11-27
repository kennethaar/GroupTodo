/* The head of the mini review (#516 follow-up): which run this is, which of
   its two steps, and the way back above the title, as a view opened from
   another has it (P15). Back stops the run; what is not sorted yet stays
   marked, and Clarify asks about it later. */
function cuRunHead(step) {
  return el("div", {class: "vhead"},
    el("div", {class: "vback"}, el("button", {class: "textbtn", onclick: cuRunEnd}, "‹ " + cuFromName())),
    el("h1", {}, CU_MARK + " Catch-up from AI"),
    el("span", {class: "sub"}, step));
}
