/* @ on picked lines: one context for all of them. Lines that already say
   where they are done are asked about first -- skip them, give them the new
   one, go through them one at a time, or take their context off -- because
   quietly overwriting @office on a line somebody set by hand is a loss
   nobody would notice until they went looking. One ctrl-z takes it all back. */
function lineSelContext() {
  const got = lineSelBlocks();
  if (!got) return;
  const path = LINE_SEL.path, snapshot = structuredClone(got.page), space = V.space;
  const blocks = got.blocks;
  openContextPicker(blocks.length === 1 ? "Pick a context for this line" : "Pick a context for " + blocks.length + " lines", ctx => {
    const have = blocks.filter(b => hasContextLink(b.title)).filter(b => contextOf(b.title) !== ctx);
    const bare = blocks.filter(b => !hasContextLink(b.title));
    const put = b => {
      b.title = hasContextLink(b.title)
        ? trim(b.title.replace(/\[\[c\/[^\]]+\]\]/g, "").replace(/\s{2,}/g, " ")) + " [[c/" + ctx + "]]"
        : trim(b.title) + " [[c/" + ctx + "]]";
    };
    const strip = b => { b.title = trim(b.title.replace(/\[\[c\/[^\]]+\]\]/g, "").replace(/\s{2,}/g, " ")); };
    const done = (n, note) => {
      pushUndo({run: () => {
        if (V.space !== space || !getPage(path)) return false;
        Object.assign(getPage(path), structuredClone(snapshot));
        touch(path); render();
        return true;
      }});
      touch(path); noteTodoTouched(); render();
      notify((n === 1 ? "1 line is now @" : n + " lines are now @") + ctx + "." + (note || ""));
    };
    if (!have.length) { for (const b of bare) put(b); done(bare.length); return; }
    const one = have.length === 1;
    chipMenu(one ? "1 line already has a context" : have.length + " lines already have a context",
      "letter picks · esc cancels", [
        ["a", "Skip " + (one ? "it" : "them"), "keep the context they have",
          () => { for (const b of bare) put(b); done(bare.length, " " + have.length + " kept their own."); }],
        ["b", "Overwrite " + (one ? "it" : "all"), "make " + (one ? "it" : "them") + " @" + ctx,
          () => { for (const b of bare.concat(have)) put(b); done(bare.length + have.length); }],
        one ? null : ["c", "Let me decide for each one", "one line at a time", () => {
          // Nothing is written until the last answer: esc halfway leaves every line as it was.
          const change = bare.slice();
          const ask = i => {
            if (i >= have.length) { for (const b of change) put(b); done(change.length); return; }
            const b = have[i];
            chipMenu((i + 1) + " of " + have.length + ": " + branchLabel(b), "letter picks · esc cancels all", [
              ["a", "Keep @" + contextOf(b.title), null, () => ask(i + 1)],
              ["b", "Make it @" + ctx, null, () => { change.push(b); ask(i + 1); }],
            ]);
          };
          ask(0);
        }],
        ["d", "Clear their contexts", "they end up with none", () => {
          for (const b of bare) put(b);
          for (const b of have) strip(b);
          done(bare.length, " " + have.length + (one ? " line has" : " lines have") + " no context now.");
        }],
      ]);
  });
}
