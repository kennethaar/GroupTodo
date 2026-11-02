/* What the mind map starts from: every kind, the best-connected first. */
const graphData = () => memo("graphData", () => graphPart(graphFull(), null, CFG.graphNodes, state.graphFocus || null));
