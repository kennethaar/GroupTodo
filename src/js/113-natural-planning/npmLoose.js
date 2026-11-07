/* The next actions that are not a component's, as Finish writes them. Only these
   can wait for each other: a component's waits by after:: (#275). */
function npmLoose() {
  const out = NPM.ideas.filter(i => i.to === "next")
    .map(i => ({key: i.id, act: i.act && trim(i.act.text || "") ? i.act : {text: i.t}}));
  if (trim(NPM.free?.text || "")) out.push({key: "free", act: NPM.free});
  return out;
}
