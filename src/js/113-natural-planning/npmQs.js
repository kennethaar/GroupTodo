function npmQs(step) {
  const k = NPM_STEPS[step].k;
  if (k === "purpose") return [
    npmList("purpose", "Why", "Why are we doing this?", "What it is for. One reason to a line."),
    npmList("onpurpose", "Must achieve", "What must this project achieve?", "The results that make it worth doing."),
    npmList("principles", "Rules we play by", "What rules do we play by?", "The standards we keep, even when it costs.")];
  if (k === "outcome") return [
    npmList("vision", "Wild success", "What would total success look like?", "Picture it done. What do you see?"),
    npmList("know", "How I'll know", "How will you know?", "Something you could see or count."),
    {k: "people", label: "Who it is for", ask: "Who has a say, or gains from it?", sub: "They go on the page as the people on it.", done: () => NPM.peopleDone || NPM.people.length > 0},
    {k: "outcome", label: "Outcome", ask: "State the outcome as already done", sub: "One line that is true the day it is finished.", done: () => !!trim(NPM.outcome)}];
  if (k === "brainstorm") return [
    {k: "ideas", label: NPM.ideas.length + " ideas", ask: "What comes to mind?", sub: "Everything: steps, worries, people, details.", done: () => NPM.ideas.length > 0}];
  if (k === "organise") return [
    {k: "sort", label: "Sort ideas", ask: "Where does this idea go?", sub: "", done: () => NPM.ideas.length > 0 && !npmUnsorted().length},
    ...(NPM.comps.length > 1 ? [{k: "order", label: "Order components", ask: "What has to come first?", sub: "A component can wait for the one above it.", done: () => !!NPM.ordered}] : [])];
  if (k === "next") return npmItems().map((it, n, all) => ({k: "item", it, n, of: all.length,
    label: it.kind === "comp" ? it.c.name : it.kind === "idea" ? it.i.t : "Next action",
    ask: "What is the very next physical action?", sub: "", done: () => !!trim(it.act.text || "") || (it.kind === "comp" && !!npmKept(it.c))}));
  if (k === "first") return [{k: "first", label: "What comes first", ask: "What can't start until this one is done?",
    sub: "It goes under that action on the page, so Next shows only what can start.",
    done: () => { const l = npmLoose(); return l.length > 1 && !npmUnplaced(l).length; }}];
  return [{k: "focus", label: "Check", ask: "Is this project off your mind now?", sub: "", done: () => false}];
}
