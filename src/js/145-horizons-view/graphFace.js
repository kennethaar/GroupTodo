/* One call paints a node, because a context is a letter rather than an outline
   and nothing else in the drawing code should have to know that. */
function graphFace(x, nd, cx, cy, r, o) {
  const shape = graphShape(nd);
  if (shape === "at") {
    x.save();
    x.font = "700 " + (r * 3).toFixed(1) + "px " + o.sans;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.lineWidth = o.hollow ? 1.4 : 2.2;
    if (o.hollow) { x.strokeStyle = o.colour; x.strokeText("@", cx, cy); }
    else {
      // Outlined in the background first, so the letter survives a line or a
      // neighbouring dot passing behind it.
      x.strokeStyle = o.bg; x.strokeText("@", cx, cy);
      x.fillStyle = o.colour; x.fillText("@", cx, cy);
    }
    x.restore();
    return;
  }
  x.beginPath();
  graphShapePath(x, shape, cx, cy, r);
  if (o.hollow) {
    x.fillStyle = o.bg; x.fill();
    x.strokeStyle = o.colour; x.lineWidth = 1.5; x.stroke();
  } else {
    x.fillStyle = o.colour; x.fill();
    // A hairline in the background colour, so two shapes that overlap still
    // read as two shapes rather than one blob.
    x.strokeStyle = o.bg; x.lineWidth = 1; x.stroke();
  }
}
