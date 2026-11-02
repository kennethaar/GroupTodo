function npmQueue(space, path) {
  if (!NPM_QUEUE.some(x => x.space === space && x.path === path)) NPM_QUEUE.push({space, path});
  notify("“" + inSpace(space, () => pageTitle(path)) + "” is next to plan, once the review is done.");
}
