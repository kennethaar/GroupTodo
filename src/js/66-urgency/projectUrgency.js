function projectUrgency(path, space) {
  return memo("purg:" + (space || "") + ":" + path, () => {
    const acts = leafActions().filter(a => a.projectPath === path && (!a.space || !space || a.space === space)
                                           && OPEN_STATES[a.state]);
    let best = acts.length ? Math.max(...acts.map(urgencyOf)) : null;
    if (best == null) {
      const props = inSpace(space, () => getPage(path)?.props || {});
      const own = dateIn(props.deadline || props.due || "");
      const chain = chainTerms(path, space);
      best = (own ? URGENCY.due * dueFactor(own) : 0) +
             (chain.blocking ? URGENCY.blocking : 0) + (chain.blocked ? URGENCY.blocked : 0);
    }
    return Math.round((best + 0.1 * Math.min(acts.length, 10)) * 10) / 10;
  });
}
