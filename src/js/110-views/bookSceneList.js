/* A chapter's scenes, once it has one with a name (#243): who sees it and
   when, its words, and its values behind ✎. The words before the first one
   are the opening. + scene adds one at the end. */
function bookSceneList(path) {
  const scenes = chapterScenes(path);
  const add = el("button", {class: "scenenew", title: "A new scene at the end of the chapter",
    onclick: () => newScenePrompt(path)}, "+ scene");
  if (!scenes.some(s => s.block)) return add;
  return el("div", {class: "bookscenes"}, ...scenes.map(s => {
    const pov = namesIn(sceneProp(s, "pov")).map(nameShown).join(", "), when = sceneProp(s, "when");
    return el("div", {class: "bookscene"},
      el("button", {class: "scn", title: "Write in it", onclick: () => openScene(s)}, s.name || "Opening"),
      pov ? el("span", {class: "scmeta", title: "Who sees it"}, pov) : null,
      when ? el("span", {class: "scmeta", title: "When in the story"}, when) : null,
      el("span", {class: "scw"}, fmtWords(sceneWords(s))),
      s.block ? el("button", {class: "scedit", title: "Its name, who sees it, where and when", "aria-label": "Edit the scene " + s.name,
        onclick: () => editScene(s)}, svgIcon(ICON_PENCIL)) : el("span", {class: "scedit", "aria-hidden": "true"}, svgIcon(ICON_PENCIL)));
  }), add);
}
