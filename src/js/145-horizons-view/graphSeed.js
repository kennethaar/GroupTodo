/* The map runs the same physics Obsidian and Logseq do (d3-force): every node
   pushes every other away, each link is a spring with a rest length, a weak
   pull to the middle keeps islands on screen, and nodes cannot overlap.
   Velocities carry over between ticks and bleed off, and "alpha" cools the
   whole thing until it stops -- so it settles smoothly instead of jittering,
   and dragging a node warms it up again so its neighbours follow.

   A deterministic start (the sunflower spiral d3 uses), so the same vault
   always settles into the same shape and you can recognise it tomorrow. */
function graphSeed(g) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  g.nodes.forEach((nd, i) => {
    nd.vx = 0; nd.vy = 0; nd.fx = null; nd.fy = null;
    const had = GRAPH_POS.get(nd.key);
    if (had) { nd.x = had.x; nd.y = had.y; return; }
    const r = 14 * Math.sqrt(0.5 + i), ang = i * golden;
    nd.x = Math.cos(ang) * r;
    nd.y = Math.sin(ang) * r;
  });
  // How many links each node has, for the spring strengths below.
  g.count = new Array(g.nodes.length).fill(0);
  for (const [i, j] of g.edges) { g.count[i]++; g.count[j]++; }
  g.comm = graphTopics(g);
}
