/* What a slide shows under its title (#433): today's bullets for a plain
   list, else its layout drawn whole, each part faint until → lights it. */
function slideBody(s) {
  if (s.layout === "list")
    return el("ul", {class: "sbullets"}, ...s.kids.map(b => {
      // A bullet that is only a picture shows it in its place (#491).
      const src = slideBulletPic(b);
      if (src) return el("li", {class: "bullet later picbullet", "data-bid": b.id},
        /^(https?|data|blob):/.test(src) ? el("img", {src, alt: ""}) : el("img", {"data-asset": src, alt: ""}));
      return el("li", {class: "bullet later", "data-bid": b.id},
        // A table among the bullets is named by its header; its own slide follows (#469).
        tableRows(b) ? tableCells(b.title).join(" · ") : slideText(b));
    }));
  const draw = {process: drawSteps, timeline: drawTimeline, cycle: drawCycle, pyramid: drawPyramid,
    hub: drawHub, curve: drawCurve, hero: drawQuote, table: drawTable,
    line: drawChartLine, bar: drawChartBar, pie: drawChartPie, map: drawMap}[s.layout] || drawCards;
  return el("div", {class: "sbody"}, draw(s));
}
