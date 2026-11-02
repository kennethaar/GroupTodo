function styleSection() {
  const card = el("div", {class: "card"});
  card.append(el("div", {class: "listblurb"},
    "How the app looks on this device. The theme button in the top bar flips between the light and the dark you pick here."));
  const now = themeOf(themeSide());
  card.append(el("div", {class: "themes"}, ...THEMES.map(t =>
    el("button", {class: "themecard" + (t.id === now ? " on" : ""), onclick: () => chooseTheme(t.id),
                  "aria-pressed": String(t.id === now)},
      el("span", {class: "sw", style: "background:" + t.sw[0]},
        el("i", {style: "width:40%;background:" + t.sw[2]}),
        el("i", {style: "width:22%;background:" + t.sw[3]}),
        el("i", {style: "width:16%;background:" + t.sw[1]})),
      el("span", {class: "tn"}, t.name + (t.id !== now && themeOf(t.side) === t.id ? "  · your " + t.side : "")),
      el("span", {class: "ta"}, t.about)))));

  const follow = el("input", {type: "checkbox"});
  follow.checked = !document.documentElement.dataset.theme;
  follow.addEventListener("change", () => setThemeSide(follow.checked ? null : themeSide()));
  card.append(el("div", {class: "stylerow"},
    el("label", {}, follow, " Light or dark follows the system")));

  const font = el("select", {"aria-label": "Font"},
    ...FONTS.map(f => el("option", {value: f.id}, f.name)));
  font.value = PREF.get("style.font", "system");
  font.addEventListener("change", () => { PREF.set("style.font", font.value); applyStyles(); });
  const size = el("select", {"aria-label": "Text size"},
    ...FONT_SIZES.map(n => el("option", {value: String(n)}, n + " px" + (n === 15 ? " (default)" : ""))));
  size.value = PREF.get("style.size", "15");
  size.addEventListener("change", () => { PREF.set("style.size", size.value); applyStyles(); });
  card.append(el("div", {class: "stylerow"}, el("label", {}, "Font"), font));
  card.append(el("div", {class: "stylerow"}, el("label", {}, "Text size"), size));

  // Anything further is a .css file in pages/8/, and that goes with the area.
  const rec = langRecord();
  const files = [...((rec && rec.css) || new Map()).keys()].sort();
  card.append(el("div", {class: "listblurb"},
    "For anything more - colours, corners, heading sizes - write a .css file in " + DIRS.lists +
    "/. It goes with the area, so everyone who opens it sees it, and it wins over the choices above."));
  for (const pth of files) card.append(el("div", {class: "prow"},
    el("span", {class: "st st-2"}, "{}"),
    el("span", {class: "nm"}, pth),
    el("span", {class: "sub"}, "edit in a text editor, then reload")));
  if (!files.includes(styleCssPath())) card.append(el("div", {class: "prow"},
    el("span", {class: "st st-2"}, "{}"),
    el("span", {class: "nm"}, "A starting stylesheet"),
    el("span", {class: "sub"}, "every setting listed, commented out"),
    el("button", {class: "btn sm ghost", onclick: makeStyleCss}, "Make " + styleCssPath())));
  return section("Styles", null, card);
}
