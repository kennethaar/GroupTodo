function openPlanTemplate(src) {
  openPromptEditor({space: src.space, path: PLAN_PROMPT_PATH, standard: PLAN_PROMPT_DEFAULT, back: () => openPlanWithAI(src),
    hint: "Words in { } are filled in each time: {name} you, {contexts} this area's contexts, {people} the people and " +
      "organisations the text names, {project} the project the lines are in, {projects} projects it may already be, " +
      "{text} the lines or the email. Kept in 8/Prompts/GTD project.md in this area. " +
      "The answer is read by its first line (the project name), the lines starting Stakeholders, Purpose, Vision " +
      "and Decide, and its TODO and WAIT lines."});
}
