/* The end of the mini review (#516 follow-up): what became of the AI's lines,
   and the way back to where it was started. A line still on the day with no
   state is a note; the rest are to-dos, also the ones filed under a project. */
function cuSummary() {
  CU_RUN.phase = "done";
  let notes = 0;
  walkBlocks((getPage(CU_RUN.path) || {}).blocks || [], b => { if (CU_RUN.ids.has(b.id) && !b.state) notes++; });
  const n = CU_RUN.total, todos = n - notes;
  const count = (k, one, many) => k + " " + (k === 1 ? one : many);
  const c = el("div", {class: "wrap"});
  const card = emptyCard(
    el("div", {style: "font-size:30px"}, CU_MARK),
    el("b", {}, count(n, "line", "lines") + " sorted: " + count(todos, "to-do", "to-dos") + ", " + count(notes, "note", "notes") + "."),
    el("br"), el("br"),
    el("button", {class: "btn primary", onclick: cuRunEnd}, "Back to " + cuFromName()));
  card.classList.add("cusum");
  c.append(cuRunHead("Done"), card);
  return c;
}
