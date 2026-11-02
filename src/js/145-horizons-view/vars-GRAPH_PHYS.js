const GRAPH_PHYS = {
  linkDist: 46,        // rest length of a link between pages
  taskDist: 26,        // a task sits close to the page it hangs off
  charge: -170,        // how hard every node pushes (scaled up for hubs)
  chargeMax: 520,      // beyond this, nodes stop pushing: islands stay near
  gravity: 0.02,       // pull toward the middle, per axis: weak, so topics can stand apart
  decay: 0.42,         // velocity lost per tick (d3's velocityDecay 0.4)
};
