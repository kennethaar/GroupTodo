/* ---------- the spaces menu, top right ----------
   Spaces are a filter, not a switch: tick any combination and every view
   shows exactly those. The name you click is where new things land. */
function renderSpacesButton() {
  const on = visibleSpaces();
  const btn = $("#spacesBtn");
  btn.textContent = "";
  btn.append(
    el("span", {class: "sqs"}, ...on.map(n => el("span", {class: "sq",
      style: "background:" + spaceColor(n) + ";color:" + inkOn(spaceColor(n))}, n[0].toUpperCase()))),
    el("span", {class: "lab"}, on.length === 1 ? on[0] : on.length + " areas"),
    el("span", {"aria-hidden": "true"}, svgIcon(ICON_CARET)));
  renderAreaBar();
  // "New things go to" says it beside the chips (#436): once is enough (P2).
  $("#capWhere").textContent = multiSpace() && Spaces.active && $("#areaBar").hidden ? "→ " + Spaces.active : "";
}
