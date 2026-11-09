/* The AI's answer, pasted back: Question:, Summary: and Why: under each
   number go on that task as ask::, brief:: and why::. With one line the
   number may be left out. An AI dresses its answers in bold and bullets, so
   those are read past. Gives {filled, same}: how many tasks got words, and
   the places in entries of those that are the same as another. map: the
   tokens names were hidden as (#345), put back first; with a token the
   prompt did not use nothing is saved, and unknown says which. */
function askAiApply(entries, text, map = null) {
  if (map) {
    const back = askUnhide(text, map);
    if (back.unknown.length) return {filled: 0, same: [], unknown: back.unknown};
    text = back.text;
  }
  const KEY = {question: ASK_Q_PROP, summary: ASK_BRIEF_PROP, why: ASK_WHY_PROP, "same as": "same"};
  const got = entries.map(() => ({}));
  let at = entries.length === 1 ? 0 : -1;
  for (let line of String(text || "").split(/\r?\n/)) {
    line = line.replace(/\*\*|__/g, "").replace(/^\s*(?:[-*•>]|#+)\s*/, "");
    const head = /^\s*(\d+)\s*[.)]\s*(.*)$/.exec(line);
    if (head) { at = +head[1] - 1; line = head[2]; }
    const kv = /^\s*(question|summary|why|same\s+as)\s*:\s*(.*)$/i.exec(line);
    if (!kv || !got[at]) continue;
    got[at][KEY[kv[1].toLowerCase().replace(/\s+/, " ")]] = trim(kv[2]).replace(/^["“](.*)["”]$/, "$1");
  }
  const same = [];
  let filled = 0;
  got.forEach((g, i) => {
    if (g.same) { same.push(i); return; }
    const e = entries[i];
    const keys = [ASK_Q_PROP, ASK_BRIEF_PROP, ASK_WHY_PROP].filter(k => g[k]);
    if (!keys.length) return;
    inSpace(e.space, () => { for (const k of keys) setBlockProp(e.block, k, g[k]); touch(e.path); });
    filled++;
  });
  return {filled, same, unknown: []};
}
