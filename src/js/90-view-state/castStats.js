function castStats(scope = "book") {
  return memo("castStats\u0000" + V.space + "\u0000" + scope + "\u0000" + bookPath(), () => {
    const {scenes, cast, isChar, chapters} = bookAnalysis(scope), hero = bookProtagonist();
    const spokenAll = scenes.reduce((n, sc) => n + sc.speeches.reduce((m, x) => m + (x.speaker ? x.words : 0), 0), 0);
    const stats = new Map(cast.map(e => [e.key, {entry: e, scenes: 0, pov: 0, first: null, last: null, without: 0,
      spoken: 0, lines: 0, talks: new Map(), other: null}]));
    for (const sc of scenes) {
      for (const k of sc.present) {
        const st = stats.get(k);
        if (!st) continue;
        st.scenes++;
        if (st.first == null) st.first = sc.chapter;
        st.last = sc.chapter;
        if (hero && k !== hero && !sc.present.has(hero)) st.without++;
      }
      if (sc.pov && stats.has(sc.pov)) stats.get(sc.pov).pov++;
      sc.speeches.forEach((x, i) => {
        const st = stats.get(x.speaker);
        if (!st) return;
        st.spoken += x.words; st.lines++;
        if (!x.to) return;
        st.talks.set(x.to, (st.talks.get(x.to) || 0) + 1);
        const back = stats.get(x.to);
        if (back) back.talks.set(x.speaker, (back.talks.get(x.speaker) || 0) + 1);
        // Two who are not the protagonist, talking, and neither naming the protagonist.
        const prev = sc.speeches[i - 1];
        if (hero && x.speaker !== hero && x.to !== hero && isChar.has(x.to) && !x.names.has(hero) && !prev.names.has(hero))
          for (const [a, line] of [[x.speaker, x], [x.to, prev]]) {
            const s = stats.get(a);
            if (s && !s.other) s.other = {scene: sc.scene, with: a === x.speaker ? x.to : x.speaker, line: line.text};
          }
      });
    }
    for (const st of stats.values()) {
      st.share = spokenAll ? st.spoken / spokenAll : 0;
      const props = st.entry.path ? getPage(st.entry.path)?.props || {} : {};
      st.depth = st.entry.type !== "character" ? null : DEPTH.map(d => ({...d,
        na: st.entry.key === hero && (d.k === "alone" || d.k === "talk"),
        ok: d.prop ? !!oneLine(props[d.prop]) : d.k === "alone" ? st.without > 0 : !!st.other,
        said: d.prop ? oneLine(props[d.prop]) : d.k === "alone" ? (st.without ? st.without + (st.without === 1 ? " scene" : " scenes") : "") : st.other ? st.other.line : ""}));
    }
    stats.hero = hero;
    stats.chapters = chapters;
    return stats;
  });
}
