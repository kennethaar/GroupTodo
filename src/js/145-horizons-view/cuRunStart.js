/* The mini review of the lines the AI wrote (#516 follow-up), started by
   Apply: Quick asks to do or note for each of them, and nothing else on the
   day, then the to-dos are sorted. Where you were is kept, to go back to. */
function cuRunStart(path, lines) {
  CU_RUN = {ids: new Set(lines.map(b => b.id)), path, total: lines.length, phase: "clarify",
    from: {view: state.view, sub: state.sub, pagePath: state.pagePath}};
  CL.editing = null;
  go("review", {sub: "days"});
  newsFirstUse(CU_NEWS, "New: the lines the AI wrote get a short review of their own.");
}
