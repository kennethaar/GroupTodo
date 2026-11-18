// An SVG element for a slide's drawing (#433); el() makes HTML only.
function slideSvg(tag, attrs = {}, ...kids) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  n.append(...kids);
  return n;
}
