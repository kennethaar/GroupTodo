/* What a slide shows under its title (#433): today's bullets for a plain
   list, else its layout drawn whole, each part faint until → lights it. */
function slideBody(s) {
  if (s.layout === "list")
    return el("ul", {class: "sbullets"}, ...s.kids.map(b => el("li", {class: "bullet later", "data-bid": b.id}, slideWords(b))));
  const draw = {process: drawSteps, timeline: drawTimeline, cycle: drawCycle, pyramid: drawPyramid,
    hub: drawHub, curve: drawCurve, hero: drawQuote}[s.layout] || drawCards;
  return el("div", {class: "sbody"}, draw(s));
}
