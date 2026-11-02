function burndownChart(series) {
  const W = 640, H = 170, L = 34, R = 10, T = 12, B = 22;
  const max = Math.max(4, ...series.map(p => p.open));
  const step = Math.pow(10, Math.floor(Math.log10(max))) * (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 2 : 1);
  const top = Math.ceil(max / step) * step;
  const x = i => L + (series.length < 2 ? (W - L - R) / 2 : i * (W - L - R) / (series.length - 1));
  const y = v => T + (H - T - B) * (1 - v / top);
  const NS = "http://www.w3.org/2000/svg";
  const s = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const svg = s("svg", {viewBox: "0 0 " + W + " " + H, class: "burn", role: "img",
    "aria-label": "Open tasks per day, from " + series[0].open + " to " + series[series.length - 1].open});
  for (let v = 0; v <= top; v += step) {
    svg.append(s("line", {x1: L, x2: W - R, y1: y(v), y2: y(v), class: "grid"}));
    const t = s("text", {x: L - 6, y: y(v) + 3.5, class: "ax", "text-anchor": "end"}); t.textContent = v; svg.append(t);
  }
  const ticks = series.length < 2 ? [0] : [0, Math.floor((series.length - 1) / 2), series.length - 1];
  for (const i of ticks) {
    const t = s("text", {x: x(i), y: H - 6, class: "ax",
      "text-anchor": i === 0 && series.length > 1 ? "start" : i === series.length - 1 && series.length > 1 ? "end" : "middle"});
    t.textContent = humanDate(series[i].day); svg.append(t);
  }
  const pts = series.map((p, i) => x(i).toFixed(1) + "," + y(p.open).toFixed(1));
  svg.append(s("path", {d: "M" + x(0) + "," + y(0) + " L" + pts.join(" L") + " L" + x(series.length - 1) + "," + y(0) + " Z", class: "area"}));
  svg.append(s("polyline", {points: pts.join(" "), class: "line"}));
  const last = series.length - 1;
  svg.append(s("circle", {cx: x(last), cy: y(series[last].open), r: 4, class: "end"}));

  // The hover layer: a crosshair on the nearest day, and what happened on it.
  const cross = s("line", {y1: T, y2: H - B, class: "cross", visibility: "hidden"});
  const dot = s("circle", {r: 4.5, class: "end", visibility: "hidden"});
  svg.append(cross, dot);
  const tip = el("div", {class: "burntip", hidden: ""});
  const box = el("div", {class: "burnbox"}, svg, tip);
  const hit = s("rect", {x: L, y: T, width: W - L - R, height: H - T - B, fill: "transparent"});
  svg.append(hit);
  const show = clientX => {
    const r = svg.getBoundingClientRect();
    const vx = (clientX - r.left) * W / r.width;
    const i = Math.max(0, Math.min(last, Math.round((vx - L) / ((W - L - R) / Math.max(1, last)))));
    const p = series[i];
    cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("visibility", "visible");
    dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(p.open)); dot.setAttribute("visibility", "visible");
    tip.hidden = false;
    tip.textContent = "";
    tip.append(el("b", {}, humanDate(p.day)), el("div", {}, p.open + " open"),
      el("div", {class: "q"}, "+" + p.added + " added · −" + p.done + " finished"));
    // Beside the crosshair, never on top of the line it is describing.
    const px = x(i) / W * r.width;
    tip.style.left = (px + 172 > r.width ? px - 172 : px + 12) + "px";
  };
  const hide = () => { tip.hidden = true; cross.setAttribute("visibility", "hidden"); dot.setAttribute("visibility", "hidden"); };
  hit.addEventListener("pointermove", e => show(e.clientX));
  hit.addEventListener("pointerdown", e => show(e.clientX));
  hit.addEventListener("pointerleave", hide);
  return box;
}
