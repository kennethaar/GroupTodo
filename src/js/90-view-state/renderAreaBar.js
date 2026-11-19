/* #436 on a wide screen every area is a chip in the bar: one click on it
   shows or hides that area, and "New things go to" says, and picks, where
   capture lands. A phone, or a vault with one area, keeps the area menu. */
function renderAreaBar() {
  const bar = $("#areaBar"), btn = $("#spacesBtn");
  if (!bar || !btn) return;
  const chips = !PHONE.matches && Spaces.list.length > 1;
  bar.hidden = !chips;
  btn.hidden = chips;
  if (chips && !$("#spop").hidden) closeSpacesMenu();
  bar.textContent = "";
  if (!chips) return;
  const shown = new Set(visibleSpaces());
  for (const sp of Spaces.list) {
    const on = shown.has(sp.name), last = on && shown.size === 1;
    const box = el("input", {type: "checkbox"});
    box.checked = on;
    box.disabled = last;
    box.addEventListener("change", async () => { if (!await showArea(sp.name, box.checked)) box.checked = true; });
    const chip = el("label", {class: "areachip" + (on ? "" : " off"),
      title: last ? "At least one area has to stay on" : (on ? "Hide " : "Show ") + sp.name + " · drag to change the order"},
      box, el("span", {class: "adot", "aria-hidden": "true", style: "background:" + spaceColor(sp.name)}), sp.name);
    bar.append(areaDraggable(chip, sp.name, () => {}));
  }
  if (shown.size > 1) bar.append(el("button", {class: "alands", "aria-haspopup": "true", "aria-expanded": "false",
    onclick: e => { e.stopPropagation(); openAreaLands(e.currentTarget); }},
    "New things go to: ", el("b", {}, Spaces.active), el("span", {"aria-hidden": "true"}, svgIcon(ICON_CARET))));
}
