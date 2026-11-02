const typeTitle = t => inSpace(t.space, () => pageTitle(t.path));
const typeStages = t => inSpace(t.space, () => stagesOf(t.path));
