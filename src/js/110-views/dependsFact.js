function dependsFact(path) {
  const deps = dependsOn(path);
  const blocked = blockersOf(path);
  const waiting = dependentsOf(path);
  const trouble = chainTrouble(path);
  return {
    key: "depends on",
    raw: DEPENDS_PROP + ":: " + deps.map(p => "[[" + pageRef(p) + "]]").join(", "),
    save: v => {
      const m = /::\s*([\s\S]*)$/.exec(v);
      const text = trim(m ? m[1] : v);
      const out = [];
      for (const raw of linksIn(text)) {
        const p = findExistingPage(trim(String(raw).split("][")[0]));
        if (p && p !== path && !out.includes(p) && !wouldCycle(path, p)) out.push(p);
      }
      writeDependsOn(path, out);
      notify(out.length ? "Chain saved." : "Chain cleared.");
    },
    pills: () => {
      const out = [];
      for (const p of deps) {
        const late = blocked.includes(p);
        out.push(factPill(pageTitle(p), "fdep" + (late ? " fbad" : ""),
          late ? "not finished yet" : "finished",
          () => chipMenu(pageTitle(p), late ? "has to finish first - it has not" : "comes first - it is done", [
            ["a", "Go to " + pageTitle(p), pageRef(p), () => openPage(p)],
            ["b", "Change what comes first", null, () => openDependsPicker(path)],
            ["c", "Take this one off the chain", "the project stays", () => {
              writeDependsOn(path, deps.filter(x => x !== p)); render(); notify("Off the chain.");
            }],
          ])));
      }
      if (!deps.length) out.push(factPill("nothing comes first", "fquiet",
        "this project can start whenever you like", () => openDependsPicker(path)));
      if (trouble) out.push(factPill("starts " + trouble.days + " day" + (trouble.days === 1 ? "" : "s") + " too early",
        "fbad", "Push this project so it starts on " + trouble.need,
        () => chipMenu("Too early", "it starts before what it waits on", [
          ["a", "Push it to " + trouble.need, null, () => { if (pushProjectTo(path, trouble.need)) { notify("Moved to start " + trouble.need + "."); render(); } }],
          ["b", "Change what comes first", null, () => openDependsPicker(path)],
        ])));
      if (waiting.length) out.push(factPill(waiting.length + " waiting on this", "fquiet",
        waiting.map(pageTitle).join(", "),
        () => chipMenu("Waiting on this", waiting.map(pageTitle).join(", "),
          waiting.slice(0, 20).map((p, i) => [String.fromCharCode(97 + i), "Go to " + pageTitle(p), pageRef(p), () => openPage(p)]))));
      return out;
    },
  };
}
