/* Copy for AI ▸ Slides (#483), mockup B: the prompt that turns text into a
   talk, the pictures the AI may pick from (and the names it cannot read),
   then a box for its answer. Make the slides puts the answer under the line
   (place, as slideAiApply takes it). The pictures are shuffled again on
   every copy, so the same text gets other pictures. */
async function openSlidesWithAI(src, place = null) {
  if (!src || !trim(src.text)) { notify("Nothing to make slides of: the line is empty.", "warn"); return; }
  const pics = await slideAiPics(src.path, src.space);
  const key = [src.space, src.path, ...(src.ids || [])].join("\u0000");
  const promptBox = el("textarea", {rows: 6, readonly: "readonly", "aria-label": "The prompt",
    style: "width:100%;font-family:var(--mono);font-size:12px"});
  const fill = () => { promptBox.value = slideAiPrompt(src.text, slideAiOrder(pics.names, pics.used)); };
  fill();
  const answer = el("textarea", {rows: 8, placeholder: "Paste the AI's answer here", "aria-label": "The AI's answer",
    style: "width:100%;font-size:12.5px;line-height:1.5"});
  if (SLIDE_AI_DRAFT.key === key) answer.value = SLIDE_AI_DRAFT.answer;
  answer.addEventListener("input", () => { SLIDE_AI_DRAFT = {key, answer: answer.value}; });
  const {select: ai, button: copyBtn} = aiPicker(src.space, promptBox, () => openSlidesWithAI(src, place));
  copyBtn.addEventListener("click", fill, true);
  const n = pics.unreadable.length;
  const where = (src.space ? src.space + " › " : "") + SLIDE_AI_DIR;
  modal({
    center: true, title: "Make slides with an AI",
    body: el("div", {},
      el("p", {class: "hint", style: "text-align:left;margin:0 0 10px"}, "Paste it into an AI with your text. Paste its answer here as slides."),
      el("div", {class: "field"}, el("label", {}, "1. Copy this to your AI"), promptBox,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Your AI in this area:"), ai, copyBtn)),
      pics.names.length ? el("div", {class: "field", style: "font-size:13px"},
        el("div", {}, "Pictures: " + pics.names.length + " in " + where),
        n ? el("details", {style: "margin-top:4px"},
          el("summary", {}, n + (n === 1 ? " name says" : " names say") + " nothing about the picture"),
          el("ul", {style: "margin:4px 0 0 18px;padding:0"}, ...pics.unreadable.slice(0, 12).map(x => el("li", {}, x)),
            n > 12 ? el("li", {}, "and " + (n - 12) + " more") : null),
          el("div", {class: "hint", style: "text-align:left;margin-top:4px"},
            "Rename them with a few words about what they show, so the AI can pick them.")) : null) : null,
      el("div", {class: "field"}, el("label", {}, "2. Paste its answer here"), answer)),
    foot: [
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn primary", onclick: () => {
        const made = slideAiApply(src, place, answer.value);
        if (!made) { notify("No lines in that. Paste the AI's whole answer: the list in its ``` block.", "warn"); return; }
        SLIDE_AI_DRAFT = {key: "", answer: ""};
        closeModal();
        notify(made + (made === 1 ? " line" : " lines") + " made into slides. Ctrl+Z takes them out.");
      }}, "Make the slides"),
    ],
  });
}
