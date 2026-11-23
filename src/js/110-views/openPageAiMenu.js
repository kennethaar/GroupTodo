/* Copy for AI from a page's ☰ menu (#483): the whole page, to Plan with AI
   or to make Slides of; a talk's answer goes at the page's end. */
function openPageAiMenu(path) {
  const page = getPage(path);
  if (!page) return;
  const src = () => planSourceOfLines(path, page.blocks);
  chipMenu("Copy for AI", pageTitle(path), lettered([
    ["Plan", "steps to an outcome, as a project", () => openPlanWithAI(src())],
    ["Slides", "a talk made of the page, with pictures from " + SLIDE_AI_DIR, () => openSlidesWithAI(src(), null)],
  ]));
}
