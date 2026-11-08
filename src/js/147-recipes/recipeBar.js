/* Over a recipe: how many you cook for. Set to anything but what the recipe
   serves, it shows the ingredients for that many, scaled; the page itself is
   never rewritten. Remembered per recipe on this device. A recipe that does
   not say how many it serves asks that first, since nothing scales without it. */
function recipeBar(path) {
  const host = el("div", {class: "recipebar"});
  const key = "recipe.for:" + (V.space || "") + "\u0000" + path;
  const draw = () => {
    const page = getPage(path), serves = recipeServings(page);
    if (!serves) {
      const box = el("input", {type: "number", min: "1", step: "1", inputmode: "numeric", "aria-label": "How many it serves"});
      const save = () => {
        const n = Math.round(Number(box.value));
        if (!(n > 0)) { notify("Write how many it serves, as a number.", "warn"); box.focus(); return; }
        page.props.servings = String(n); touch(path); render();
      };
      box.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
      host.replaceChildren(el("div", {class: "fbar"},
        el("span", {class: "hint"}, "How many does it serve? Then you can cook it for more or fewer."), box,
        el("button", {class: "btn sm ghost", onclick: save}, "Save")));
      return;
    }
    const n = Math.max(1, Math.round(Number(PREF.get(key, "")) || serves));
    const set = v => { v = Math.max(1, Math.min(999, Math.round(v) || serves)); PREF.set(key, v === serves ? "" : String(v)); draw(); };
    const box = el("input", {type: "number", min: "1", max: "999", step: "1", inputmode: "numeric", value: String(n),
      "aria-label": "Cook for how many"});
    box.addEventListener("change", () => set(Number(box.value)));
    const bar = el("div", {class: "fbar"},
      el("span", {}, "Cook for"),
      el("button", {class: "btn sm ghost", "aria-label": "One fewer", disabled: n <= 1 ? "" : null, onclick: () => set(n - 1)}, "−"),
      box,
      el("button", {class: "btn sm ghost", "aria-label": "One more", onclick: () => set(n + 1)}, "+"),
      n === serves ? null : el("span", {class: "hint"}, "The recipe is for " + serves + "."),
      n === serves ? null : el("button", {class: "btn sm ghost", onclick: () => set(serves)}, "Back to " + serves));
    const lines = n === serves ? [] : recipeScaledLines(path, n) || [];
    host.replaceChildren(bar, lines.length ? el("div", {class: "section recipescaled"},
      el("h2", {}, "Ingredients for " + n),
      el("ul", {}, ...lines.map(l => el("li", {}, linkWords(l)))),
      el("div", {class: "hint"}, "Times, pans and oven heat stay as written.")) : "");
  };
  draw();
  return host;
}
