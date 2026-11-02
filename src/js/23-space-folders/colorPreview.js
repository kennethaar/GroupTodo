/* The two places a space's colour is actually read: the sidebar avatar and the
   badge rows carry when spaces are shown together. Showing both while choosing
   beats discovering afterwards that two spaces came out the same. `name` may be
   a getter, for a space whose name is still being typed; paint() with no colour
   repaints the name alone. */
function colorPreview(name, hex) {
  const box = el("div", {class: "cpreview"});
  let cur = normHex(hex) || SPACE_COLORS[0];
  const paint = c => {
    cur = normHex(c) || cur;
    const label = trim(typeof name === "function" ? name() : name) || "Area";
    box.textContent = "";
    box.append(
      el("span", {class: "avatar", style: "background:" + cur + ";color:" + inkOn(cur)},
        label[0].toUpperCase()),
      el("span", {class: "chip spacechip", style: "color:" + cur + ";border-color:" + cur + "55"},
        label),
      el("span", {style: "color:var(--fg3);font-size:11.5px"}, paletteName(cur)));
    // The badge is drawn in the colour itself, so one too close to the page
    // disappears. Say so here rather than let it be found in a crowded list.
    if (contrast(cur, themeSurface()) < 3) {
      box.append(el("span", {style: "color:var(--warn);font-size:11.5px"},
        "- too close to the page behind it to read"));
    }
  };
  paint(cur);
  return {node: box, paint};
}
