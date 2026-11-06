function askCardShow(link, name) {
  askCardHide();
  if (!link.isConnected) return;
  const line = blockBehind(link);
  const box = el("div", {class: "askcard", role: "dialog", "aria-label": name},
    el("b", {}, name),
    el("button", {class: "btn sm", onclick: () => { askCardHide(); openAskForUpdate(name, line && line.block); }},
      svgIcon(ICON_MAIL), " Ask for an update"));
  document.body.append(box);
  // Under the name, or over it when there is no room under.
  const r = link.getBoundingClientRect(), w = box.offsetWidth, h = box.offsetHeight;
  box.style.left = Math.min(Math.max(12, r.left), innerWidth - w - 12) + "px";
  box.style.top = (r.bottom + 4 + h > innerHeight - 12 ? Math.max(12, r.top - 4 - h) : r.bottom + 4) + "px";
  ASK_CARD = {box, link};
}
