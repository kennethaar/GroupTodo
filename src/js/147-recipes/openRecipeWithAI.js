/* New recipe: a link or the recipe's text, made into a prompt for your AI,
   and the answer pasted back made into a numbered recipe page in metric. A
   recipe already written in that shape can go straight into the answer box. */
function openRecipeWithAI() {
  const space = V.space;
  const source = el("textarea", {rows: 4, placeholder: "A web address, or the recipe copied from anywhere",
    style: "width:100%;font-size:12.5px;line-height:1.5"});
  source.value = RECIPE_DRAFT.text;
  const promptBox = el("textarea", {rows: 5, readonly: "readonly", "aria-label": "The prompt",
    style: "width:100%;font-family:var(--mono);font-size:12px"});
  const answer = el("textarea", {rows: 9, placeholder: "Paste the AI's answer here", style: "width:100%;font-size:12.5px;line-height:1.5"});
  answer.value = RECIPE_DRAFT.answer;
  const keep = () => { RECIPE_DRAFT = {text: source.value, answer: answer.value}; };
  const fill = () => { promptBox.value = recipePromptFor(source.value, space); };
  source.addEventListener("input", () => { keep(); fill(); });
  answer.addEventListener("input", keep);
  fill();
  const {select, button} = aiPicker(space, promptBox, openRecipeWithAI);
  const make = () => {
    const path = applyRecipeAnswer(answer.value);
    if (!path) { notify("Paste the AI's answer first. It starts with the recipe's name.", "warn"); answer.focus(); return; }
    RECIPE_DRAFT = {text: "", answer: ""};
    closeModal();
    openPage(path);
    notify("Recipe " + getPage(path).props.no + ": " + pageTitle(path));
  };
  modal({
    center: true, title: "New recipe",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "1. The recipe"), source),
      el("div", {class: "field"}, el("label", {}, "2. Copy this to your AI"), promptBox,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Your AI in this area:"), select, button),
        el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
          "It writes the recipe in grams, litres and °C, so every recipe here can be scaled the same way.")),
      el("div", {class: "field"}, el("label", {}, "3. Paste its answer here"), answer)),
    foot: [
      el("button", {class: "btn ghost", onclick: () => openPromptEditor({space, path: RECIPE_PROMPT_PATH,
        standard: RECIPE_PROMPT_DEFAULT, back: openRecipeWithAI,
        hint: "{text} is filled in with the link or the recipe. Kept in 8/Prompts/Recipe.md in this area. " +
          "The answer is read by its first line (the name), the servings:: and other such lines under it, and the lines " +
          "under its Ingredients heading, each starting with its amount."})}, "Edit the prompt"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn primary", onclick: make}, "Make the recipe"),
    ],
  });
}
