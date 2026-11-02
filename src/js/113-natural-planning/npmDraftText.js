function npmDraftText(d) {
  return ["<!-- Written by GroupToDo: a natural planning draft for " + baseName(d.path) +
    ". It goes once the plan is written to the page. -->", "",
    "by:: " + (d.by || ""), "at:: " + (d.at || ""), "", "```json", JSON.stringify(d), "```", ""].join("\n");
}
