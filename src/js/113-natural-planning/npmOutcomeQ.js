function npmOutcomeQ() {
  const input = el("input", {class: "npmin", value: NPM.outcome || "", placeholder: "A monthly newsletter goes out and 40% open it",
    "aria-label": "Outcome"});
  const say = el("div", {class: "npmsay"});
  const tell = () => {
    const s = npmOutcomeSay(input.value);
    say.className = "npmsay" + (s ? " " + s[0] : "");
    say.replaceChildren(...(s ? (s[0] === "ok" ? [svgIcon(ICON_CHECK), " " + s[1]] : [s[1]])
      : ["Not a topic like “Newsletter”, but what is true when it is done."]));
  };
  input.addEventListener("input", () => { NPM.outcome = input.value; npmSave(); tell(); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); npmNext(); } });
  tell();
  const notes = [...NPM.vision, ...NPM.know, ...NPM.purpose].slice(0, 4);
  return [notes.length ? el("div", {class: "npmnotes"}, el("span", {class: "npmh"}, "Your notes"), ...notes.map(n => el("span", {}, "“" + n + "”"))) : null,
    el("label", {class: "npmh"}, "outcome::"), input, say,
    NPM.people.length ? el("div", {class: "npmsay"}, "For: " + NPM.people.join(", ")) : null].filter(Boolean);
}
