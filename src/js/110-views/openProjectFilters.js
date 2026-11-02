function openProjectFilters(area, orgs) {
  const body = el("div", {});
  const draw = () => body.replaceChildren(
    area.opts.length ? choiceGroup("Area", area.opts, PREF.get("projects.area", ""), v => { area.set(v); draw(); }) : "",
    orgs.length ? choiceGroup("Organisation", [["", "All organisations"], ...orgs.map(o => [o, o])], state.org || "",
      v => { go("projects", {org: v || null}); draw(); }) : "");
  draw();
  modal({title: "Filter projects", body, foot: [
    el("button", {class: "btn", onclick: () => { PREF.set("projects.area", ""); go("projects", {org: null}); closeModal(); }}, "Clear filters"),
    el("button", {class: "btn primary", onclick: () => closeModal()}, "Done")]});
}
