/* The GTD question, answered. A box of its own (box) means the answer lands
   when that closes. how says what it writes, and the key that does the same
   on a page, so the review teaches the keys as it goes. */
const CL_GROUPS = ["Something to do", "Not now", "Nothing to do"];
const CL_ANSWERS = [
  {g: 0, label: "To do", say: "one step you can do", how: "A to do on the day page. On a page: · and a space, or Ctrl+Enter.",
    run: (path, b) => setBlockState(path, b, "TODO")},
  {g: 0, label: "Waiting for", say: "somebody else does it", box: true, how: "A to do that waits on someone. On a page: Ctrl+Enter until WAIT.",
    run: (path, b) => askWaitingOn({path, block: b, state: b.state, title: b.title, space: V.space}, true)},
  {g: 0, label: "Project", say: "more than one step", box: true, how: "A project page, linked from the line. On a page: Alt+1.",
    run: (path, b) => makeFromLine(path, b, "project")},
  {g: 1, label: "Someday/maybe", say: "not now, maybe later", how: "A project on the Someday/Maybe shelf. On a page: Alt+2.",
    run: clSomeday},
  {g: 1, label: "Idea to explore", say: "a note of its own (zettel)", box: true, how: "A note page, linked from the line. On a page: Alt+Z.",
    run: (path, b) => makeFromLine(path, b, "zettel")},
  {g: 2, label: "Done already", say: "nothing left to do", how: "Ticked done on the day page.",
    run: (path, b) => setBlockState(path, b, "DONE")},
  {g: 2, label: "Leave it as a note", say: "a thought, or reference", how: "Stays on the day page as it is.",
    run: () => {}},
];
