// What can get a next action now: components nothing comes before, and ideas sorted straight to action.
function npmItems() {
  const out = [];
  for (const c of NPM.comps) if (!c.after || !npmComp(c.after)) out.push({kind: "comp", c, act: c.act || (c.act = {})});
  for (const i of NPM.ideas.filter(i => i.to === "next")) out.push({kind: "idea", i, act: i.act || (i.act = {text: i.t})});
  if (!out.length) out.push({kind: "free", act: NPM.free || (NPM.free = {})});
  return out;
}
