/* Lays the shape into the current path, so the caller keeps deciding whether
   it is filled (there is a page, the todo is open) or hollow (there is not). */
function graphShapePath(x, shape, cx, cy, r) {
  if (shape === "bust") {
    const k = 1.3 * r, X = u => cx + u * k, Y = u => cy + u * k;
    x.moveTo(X(-.86), Y(1));                                        // shoulders
    x.bezierCurveTo(X(-.86), Y(.04), X(.86), Y(.04), X(.86), Y(1));
    x.closePath();
    x.moveTo(X(.45), Y(-.42));                                      // head
    x.arc(X(0), Y(-.42), .45 * k, 0, Math.PI * 2);
    return;
  }
  const spec = GRAPH_OUTLINE[shape];
  if (!spec) { x.arc(cx, cy, r, 0, Math.PI * 2); return; }
  const k = spec.k * r;
  for (const poly of spec.poly) {
    for (let i = 0; i < poly.length; i++) {
      const px = cx + poly[i][0] * k, py = cy + poly[i][1] * k;
      if (i) x.lineTo(px, py); else x.moveTo(px, py);
    }
    x.closePath();
  }
}
