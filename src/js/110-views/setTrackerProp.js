function setTrackerProp(name, k, v) {
  const at = ensureTrackerPage(name);
  inSpace(at.space, () => {
    const props = getPage(at.path).props;
    for (const old of Object.keys(props)) if (old.toLowerCase() === k) delete props[old];
    if (v) props[k] = v;
    touch(at.path);
  });
}
