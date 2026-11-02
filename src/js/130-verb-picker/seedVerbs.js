/* ============================================================
   130_VERB_PICKER
   Port of: init.lua suggest_phys_viz_verb
   ============================================================ */
function seedVerbs() {
  for (const [lang, verbs] of Object.entries(SEED_VERBS)) {
    for (const [canonical, syns] of Object.entries(verbs)) {
      const p = join(DIRS.verbs, lang, canonical + ".md");
      if (V.pages.has(p)) continue;
      putPage(p, {
        props: {title: canonical, type: "verb", lang},
        blocks: [newBlock({title: canonical + " = " + canonical}),
                 ...syns.map(x => newBlock({title: x + " = " + canonical}))],
      });
    }
  }
  scanVerbs();
  notify("Installed " + Object.keys(VERB_CANON).length + " verbs under pages/verbs/.");
}
