/* Show choice i in the slide preview (#465): that talk's step, drawn small. */
function slidePeekPick(i) {
  const P = SLIDE_PEEK;
  if (!P) return;
  i = Math.max(0, Math.min(P.choices.length - 1, i));
  if (i === P.on) return;
  P.on = i;
  P.peek.querySelectorAll(".peekpick").forEach((b, n) => b.setAttribute("aria-pressed", String(n === i)));
  const {deck, at} = P.choices[i], step = deck.steps[at];
  const stage = el("div", {id: "deckpeek", style: `transform:scale(${P.scale})`});
  if (P.own) stage.append(el("style", {class: "deckcss"}, P.own));
  P.stage.replaceChildren(stage);
  const slide = slideSection(step.s);
  stage.append(slide);
  resolveAssets(slide);
  slideBullets(slide, step, false);
}
