/* Only the count: the comments themselves are met one at a time in the
   review, and what happened without a word stays in History (#285). */
function newsBox() {
  const n = feedbackQueue().length;
  if (!n) return null;
  return el("div", {class: "news"},
    el("span", {"aria-hidden": "true"}, "●"),
    el("div", {class: "newsrow"},
      el("b", {}, "Since you were last here"),
      el("span", {}, "Feedback ", el("b", {class: "newsn"}, String(n))),
      el("button", {class: "btn sm", onclick: () => openFeedbackReview()}, "Review")));
}
