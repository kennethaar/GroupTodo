/* The projects put aside to plan again, beside the review's table. */
function npmQueueList() {
  if (!NPM_QUEUE.length) return null;
  return el("div", {class: "npmqueue"}, el("div", {class: "npmh"}, "To plan after the review"),
    ...NPM_QUEUE.map(x => el("button", {class: "textbtn", onclick: () => npmOpen(x.space, x.path)}, inSpace(x.space, () => pageTitle(x.path)))));
}
