/* One What's new animation in a dialog of its own (#516 follow-up), on the
   same stage as What's new: it plays once, then offers Play again. */
function newsShowOne(key) {
  const [version, issue] = key.split("#");
  const cap = (newsSteps(NEWS_ANIM[key]).find(s => s[0] === "cap") || [])[2] || "What's new";
  const stage = newsStage([{version, items: [{lead: cap, issue}]}], el("div"));
  if (!stage) return;
  modal({center: true, title: "How it works", body: stage,
    foot: [el("div", {style: "flex:1"}), el("button", {class: "btn primary", onclick: closeModal}, "Got it")]});
}
