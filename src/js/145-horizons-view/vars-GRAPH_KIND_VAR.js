/* ---------- graph ----------
   Every page, and the [[links]] between them. The shape is worked out by
   pushing all the pages apart and pulling linked ones together until it stops
   moving, which is why clusters appear: the things you write about together
   end up near each other without anybody filing them.

   It is a canvas and not a pile of divs because a few hundred dots and a few
   thousand lines as DOM elements is a slideshow, and because this is the one
   screen in the app that is a picture rather than a document. */
const GRAPH_KIND_VAR = {
  project: "--proj", journal: "--fg3", person: "--zet", context: "--ctx",
  zettel: "--zet", email: "--zet", review: "--zet", area: "--accent", goal: "--accent", horizon: "--accent",
  checklist: "--done", org: "--wait",
  // the mindmap hangs the tasks themselves off their page, coloured by state
  TODO: "--todo", DOING: "--doing", WAIT: "--wait", DONE: "--done", CANCELLED: "--cancel",
};

/* ---------- what each kind of thing looks like ----------
   Colour here already means state, so what a dot IS has to be said by its
   silhouette instead: a todo is a lightning bolt, a person a bust, an org a
   square house with a roof, a project a flag, and a context the @ it is
   written as everywhere else in the app. Everything else stays a plain dot,
   which is what makes the five named shapes findable at a glance. */
const GRAPH_SHAPE = {person: "bust", org: "house", project: "flag", context: "at"};
const graphShape = nd => nd && nd.task ? "bolt" : (nd && GRAPH_SHAPE[nd.kind]) || "dot";

/* Unit outlines in a box around the node, y downward, scaled by the radius the
   dot would have had. The thin shapes carry a bigger multiplier so a bolt and
   a circle read as the same weight rather than the bolt reading as smaller. */
const GRAPH_OUTLINE = {
  bolt : {k: 1.5,  poly: [[[.18, -1], [-.62, .14], [-.1, .14], [-.32, 1], [.62, -.2], [.08, -.2]]]},
  house: {k: 1.22, poly: [[[0, -1], [1, -.3], [.74, -.3], [.74, .92], [-.74, .92], [-.74, -.3], [-1, -.3]]]},
  flag : {k: 1.4,  poly: [[[-.6, -1], [-.34, -1], [-.34, 1], [-.6, 1]],
                          [[-.28, -.92], [.86, -.5], [-.28, -.08]]]},
};
