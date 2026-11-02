/* One arrow, from the card's place on the play mat to the pill it would land
   on. The card in hand sits under the pointer, so an arrow from there would
   have no length. */
function solArrow(from, pill, word) {
  if (!from || !pill || !pill.isConnected) {
    if (SOL_ARROW) { SOL_ARROW.svg.remove(); SOL_ARROW.tag.remove(); SOL_ARROW = null; }
    return;
  }
  if (!SOL_ARROW) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "solarrow");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<defs><marker id="solhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="var(--accent)"/></marker></defs>' +
      '<path class="solarrow-line" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="7 5" marker-end="url(#solhead)"/>';
    const tag = el("div", {class: "solarrow-lbl"});
    document.body.append(svg, tag);
    SOL_ARROW = {svg, tag};
  }
  const [x1, y1] = solMid(from.getBoundingClientRect());
  const pr = pill.getBoundingClientRect();
  // The arrow stops at the pill's edge, not in its middle, so the words stay readable.
  const [cx, cy] = solMid(pr), len = Math.hypot(cx - x1, cy - y1) || 1;
  const stop = Math.min(len - 4, Math.max(0, len - Math.min(pr.width, pr.height) / 2 - 6));
  const x2 = x1 + (cx - x1) * stop / len, y2 = y1 + (cy - y1) * stop / len;
  const bend = Math.min(80, len / 4);
  const mx = (x1 + x2) / 2 - (y2 - y1) / len * bend, my = (y1 + y2) / 2 + (x2 - x1) / len * bend;
  SOL_ARROW.svg.querySelector(".solarrow-line").setAttribute("d", "M" + x1 + " " + y1 + " Q" + mx + " " + my + " " + x2 + " " + y2);
  SOL_ARROW.tag.textContent = word;
  Object.assign(SOL_ARROW.tag.style, {left: (x1 + 2 * mx + x2) / 4 + "px", top: (y1 + 2 * my + y2) / 4 + "px"});
}
