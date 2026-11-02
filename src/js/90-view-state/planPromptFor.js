function planPromptFor(src, cands) {
  const name = whoAmI() || "the user";
  const ctxs = ctxFolderOrder(contextList());
  const people = planKnownNames(src.text);
  const fill = {
    name,
    contexts: ctxs.length ? ctxs.map(c => "[[c/" + c + "]]").join(" ") : "(this area has none yet: leave the context out)",
    project: src.project
      ? "The text belongs to the existing project \"" + src.project.title + "\"" +
        (trim(getPage(src.project.path)?.props?.outcome || "") ? " (done when: " + trim(getPage(src.project.path).props.outcome) + ")" : "") +
        ". Use exactly that name as the project name."
      : "",
    projects: cands.length
      ? "These projects already exist and may be the same thing. If one of them is, use its name exactly as written " +
        "as the project name; if none is, make a new one:\n" + cands.map(c => "- " + c.title).join("\n")
      : "",
    people: people.length ? "Already known, write them exactly like this: " + people.join(", ") : "",
    text: src.text,
  };
  return planTemplate(src.space).replace(/\{(name|contexts|project|projects|people|text)\}/g, (m, k) => fill[k])
    .replace(/\n{3,}/g, "\n\n");
}
