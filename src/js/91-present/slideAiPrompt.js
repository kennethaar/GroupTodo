/* The prompt Copy for AI ▸ Slides copies (#483): how the app reads a list
   as slides, built from the layout words themselves so it always matches,
   then the pictures to pick from (left out when there are none), then the
   text. pics are file names in assets/slides/, in the order to try them. */
function slideAiPrompt(text, pics = []) {
  const need = ([, lay]) => lay === "quadrant" ? " (exactly 4 points)"
    : lay === "pie" ? ` (at most ${CHART_PIE_MAX} parts)`
    : SLIDE_LAYOUTS[lay].min >= 3 ? ` (${SLIDE_LAYOUTS[lay].min} points or more)` : "";
  const out = [
    "Turn my text below into slides for a talk. Answer with one Markdown list inside a ``` block.",
    "",
    "How the app reads the list:",
    "- Each top line is a slide's title. The lines under it, each starting \"- \", are its points.",
    `- Keep a slide to ${SLIDE_CALM} points or fewer. Split a long one into two slides.`,
    "- A top line with nothing under it is a section slide: its title, big and alone.",
    "- A layout word in brackets at the start of a title says how the points are drawn, as in \"- (cycle) How we work\".",
    "  Use one only where it fits the points. With no word, the points are a plain list. The words:",
    ...SLIDE_WORDS.map(w => `  (${w[0]}) ${w[3]}${need(w)}`),
    "- Points that end in a number, as in \"2024 2600\" or \"North 42\", are drawn as a chart: (line), (bar) or (pie) says which.",
    "- A Markdown table under a title is drawn as a table, or as a chart under (line), (bar) or (pie).",
    "- (map) puts the picture on its title line behind the whole slide. Under it, a line that is only a picture is a card (its own lines under it: name, role); a picture with words is a logo badge; a line that starts with an emoji, as in \"📍 Oslo\", is a pin. Pins under a card or badge come with it.",
    "- Put **bold** round the key term of a point, at most one per point.",
    "- Speaker notes are plain lines with no \"- \", right under a title and indented like its points. They are not shown on the slide.",
    "- Write in the language of my text. Keep my facts; add none.",
  ];
  if (pics.length) out.push(
    "",
    "Pictures: the files below are in the folder. Give a slide a picture only when a name fits what the slide is about.",
    "- Put it as the first line under the title, before any notes: ![](" + SLIDE_AI_DIR + "/NAME)",
    "- Take the first name in the list that fits. Write it exactly as listed.",
    "- Use each picture once in the talk, unless a slide comes back to an earlier point (a recap): then the same picture ties the two together.",
    "- Never make up a name. No unused name fits: no picture on that slide.",
    ...pics.map(n => "  " + n));
  out.push("", "My text:", "", String(text || "").trim());
  return out.join("\n");
}
