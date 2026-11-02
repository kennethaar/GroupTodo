function textHorizonCard(key, h) {
  const lines = getHorizon(key);
  const card = el("div", {class: "card"});
  if (!lines.length) {
    card.append(el("div", {class: "empty"}, h.ask));
  } else {
    for (const l of lines) card.append(el("div", {class: "dash-item", translate: "no", html: renderInline(l)}));
  }
  return card;
}
