/* The task row's tick, on a linked line: Done, or back to To do. It is the
   line's own control, so it never opens the page the line is on. */
function backlinkTick(path, block) {
  const space = V.space, done = block.state === "DONE";
  const stop = e => e.stopPropagation();
  return el("button", {class: "tick", data: {state: block.state},
    title: done ? "Not done after all" : "Done",
    "aria-label": (done ? "Not done after all: " : "Done: ") + bujoText(block.title),
    onkeydown: stop,
    onclick: e => {
      stop(e);
      rowSetState({path, block, state: block.state, space},
        () => setBlockState(path, block, done ? "TODO" : "DONE"), false);
    }}, ...tickParts(block.state, block));
}
