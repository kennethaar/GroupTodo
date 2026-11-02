const gX = (g, n) => n.x * g.view.scale + g.view.ox;
const gY = (g, n) => n.y * g.view.scale + g.view.oy;

const graphRadius = nd => 3.4 + Math.min(nd.deg, 16) * 0.55;
