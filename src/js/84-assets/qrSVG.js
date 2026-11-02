// Black on white whatever the theme, with the four-module margin a camera needs.
function qrSVG(text) {
  const rows = qrEncode(text);
  if (!rows) return null;
  const q = 4, w = rows.length + 2 * q;
  let d = "";
  rows.forEach((row, y) => row.forEach((dark, x) => { if (dark) d += `M${x + q} ${y + q}h1v1h-1z`; }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${w}" shape-rendering="crispEdges" role="img" aria-label="QR code">` +
    `<rect width="${w}" height="${w}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
