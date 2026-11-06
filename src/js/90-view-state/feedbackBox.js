function feedbackBox() {
  const link = (href, icon, text) => el("a", {class: "btn ghost sm", href, target: "_blank", rel: "noopener"}, svgIcon(icon), " " + text);
  return el("div", {class: "feedback"},
    el("strong", {}, "Still missing a key feature?"),
    el("p", {}, "Tell us what would make GroupToDo better for you. It takes a minute on GitHub."),
    el("div", {class: "acts"},
      link(issueUrl("idea"), ICON_LIGHTBULB, "Suggest a feature"),
      link(issueUrl("bug"), ICON_BUG, "Report a bug"),
      link(REPO_URL, ICON_STAR, "Star on GitHub")));
}
