/* The lines that go under a line in the ask, each with whether it is ticked
   to go (#344): the question, on something they owe you (a question line
   carries it in place of its own words); the summary, which stands in for
   your notes; your notes, ticked only when there is no summary; why it
   matters; and when it was asked and what they last said. */
function askContextOf(a, name) {
  const b = a.block;
  if (!b) return [];
  const t = ASK_NOTE[askLang()] || ASK_NOTE.en, prop = k => trim(blockProp(b, k) || "");
  return inSpace(a.space, () => {
    const ask = prop(ASK_Q_PROP), brief = prop(ASK_BRIEF_PROP), why = prop(ASK_WHY_PROP), facts = askFacts(b, name);
    return [
      ...(ask && !a.mention ? [{depth: 0, text: t.qW + " " + ask, on: true}] : []),
      ...(brief ? [{depth: 0, text: brief, on: true}] : []),
      ...contextLinesOf(b).map(l => Object.assign(l, {on: !brief})),
      ...(why ? [{depth: 0, text: t.whyW + " " + why, on: true}] : []),
      ...(facts ? [{depth: 0, text: facts, on: true}] : []),
    ];
  });
}
