/* The whole book read once: per scene who is in it, who speaks each line and
   to whom, and what they name while they speak. A line of speech is the
   speaker's whose name comes first outside the quotes. Untagged, the talk
   goes back and forth: the one before the last speaker, or with two in the
   scene, the other one. */
/* scope "all" reads every book in the area as one story, chapter after
   chapter; a scene's chapter is its place in that. */
function bookAnalysis(scope = "book") {
  return memo("bookAnalysis\u0000" + V.space + "\u0000" + scope + "\u0000" + bookPath(), () => {
    const cast = castEntries(), chapters = scope === "all" ? seriesChapters() : bookChapters();
    const isChar = new Set(cast.filter(e => e.type === "character").map(e => e.key));
    const scenes = [];
    chapters.forEach((ch, ci) => {
      if (!ch.path) return;
      const style = dialogueStyle(ch.book);
      chapterScenes(ch.path).forEach(s => {
        const pov = castEntryOf(namesIn(sceneProp(s, "pov"))[0] || "")?.key || null;
        const present = new Set([...namesIn(sceneProp(s, "pov")), ...namesIn(sceneProp(s, "with")), ...namesIn(sceneProp(s, "place"))]
          .map(r => castEntryOf(r)?.key).filter(Boolean));
        const speeches = [];
        let words = 0;
        for (const p of proseOf(s.lines)) {
          words += countWords(p);
          for (const m of castMentions(p)) present.add(m.key);
          const parts = speechParts(p, style);
          if (!parts.said.length) continue;
          const said = parts.said.join(" ");
          const tagged = castMentions(parts.rest).map(m => m.key).find(k => isChar.has(k));
          const prev = speeches.length ? speeches[speeches.length - 1].speaker : null;
          const before = prev ? [...speeches].reverse().find(x => x.speaker && x.speaker !== prev)?.speaker : null;
          const chars = [...present].filter(k => isChar.has(k));
          const speaker = tagged || before || (prev && chars.length === 2 && chars.includes(prev) ? chars.find(k => k !== prev) : null);
          speeches.push({speaker, to: prev && prev !== speaker ? prev : null, words: countWords(said), text: said,
            names: new Set(castMentions(said).map(m => m.key))});
        }
        scenes.push({chapter: ci, scene: s, pov, present, speeches, words});
      });
    });
    return {scenes, cast, isChar, chapters};
  });
}
