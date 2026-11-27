/* The foot of every help topic, in the pane and the full help (#513): the
   two ways to give feedback, quiet, one scroll away wherever you are reading. */
function helpFeedback() {
  const link = (href, icon, text) => el("a", {class: "btn ghost sm", href, target: "_blank", rel: "noopener"}, svgIcon(icon), " " + text);
  return el("div", {class: "helpfeedback"},
    el("p", {}, "Missing something, or broken?"),
    el("div", {class: "acts"},
      link(issueUrl("idea"), ICON_LIGHTBULB, "Suggest a feature"),
      link(issueUrl("bug"), ICON_BUG, "Report a bug")));
}
