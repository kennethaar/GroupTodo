/* With task types there is more than one set of states, so each is a column:
   the plain states, then every type's stages. A stage in another column
   changes the type; the plain column takes the type off. The letters stay on
   the plain states and the numbers on the task's own type, as they were. */
function stateColumns(a, extra = []) {
  const types = inSpace(a.space, typeChoices);
  if (!types.length) return null;
  const t = inSpace(a.space, () => taskStage(a.block));
  const plain = PLAIN_STATES.map(([k, label, st]) => {
      const now = !t && a.state === st;
      return [k, label, now ? "now" : null,
        () => now ? null : rowSetState(a, () => setBlockState(a.path, a.block, st, {stage: {list: null}}))];
    });
  return [{head: "Plain", cur: !t, rows: [...plain, ...extra]},
    ...types.map(ty => {
      const own = !!t && ty.space === inSpace(a.space, () => V.space) && t.list === ty.path;
      return {head: typeTitle(ty), cur: own, rows: typeStages(ty).map((st, i) =>
        [own && i < 9 ? String(i + 1) : "", st.name,
         own && t.stage && t.stage.name === st.name ? "now" : CORE_WORD[st.core],
         () => rowSetState(a, () => setTaskStage(a.path, a.block, typeHere(ty), st.name), false)])};
    })];
}
