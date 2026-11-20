/* The steps of the project that wait behind another are not dealt: only the
   very next action of each sequence is (#462). In Still to do the card ends
   with how many wait, and a click deals them too. They are never asked for a
   verb or a context: that comes when one is the next action. */
function actMoreSteps(r) {
  if (solPassNo() !== 0 || isJournalPath(r.path) || r.projectPath !== r.path || !SOL.order) return null;
  const dealt = new Set(SOL.order.map(x => x.block)), wait = [];
  for (const root of actSortRoots(r)) walkBlocks([root], b => {
    // A Doing step is dealt as a next action already, so it does not wait.
    if (b.state === "TODO" && hasOpenDescendant(b) && !dealt.has(b)) wait.push(b);
  });
  if (!wait.length) return null;
  const project = inS(r, () => pageTitle(r.path));
  return el("button", {class: "textbtn actmore", onclick: e => {
    e.stopPropagation();
    const rows = wait.map(b => Object.assign({}, r, {block: b, state: b.state, title: b.title,
      due: inS(r, () => effectiveDue(b)), context: inS(r, () => blockContext(b)), age: blockAge(b) ?? r.age}));
    SOL.order.splice(SOL.i + 1, 0, ...rows);
    render();
  }}, "+ " + wait.length + (wait.length === 1 ? " more step in " : " more steps in ") + project);
}
