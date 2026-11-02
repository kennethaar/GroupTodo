/* The same rationing, for a list of anything that is not a task: pages,
   conversations, health findings. Everything that draws a long list goes
   through here, so "show all" means the same thing wherever you press it. */
/* A card that says there is nothing here, and why. */
const emptyCard = (...why) => el("div", {class: "card"}, el("div", {class: "empty"}, ...why));
/* The name of a page row, read in the area the row came from. */
const rowTitle = r => inSpace(r.space, () => pageTitle(r.path));
