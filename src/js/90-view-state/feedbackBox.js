function feedbackBox() {
  const link = (href, text) => el("a", {class: "btn ghost sm", href, target: "_blank", rel: "noopener"}, text);
  return el("div", {class: "feedback"},
    el("strong", {}, "Still missing a key feature?"),
    el("p", {}, "Tell us what would make GroupToDo better for you. It takes a minute on GitHub."),
    el("div", {class: "acts"},
      link(issueUrl("idea"), "💡 Suggest a feature"),
      link(issueUrl("bug"), "🐞 Report a bug"),
      link(REPO_URL, "⭐ Star on GitHub")));
}
