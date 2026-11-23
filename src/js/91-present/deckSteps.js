/* The page as one walk (#431): the title first, then each top line as a
   slide. A slide shows its title, then its lines one step at a time; a line
   with lines of its own is not shown as a bullet first: → goes straight into
   its slide, and after it the bullet is in its place, done. So → is always
   just "next", in the order the outline is written.
   From one bullet (☰ › Present from here), that bullet is the title slide and
   its lines are the top slides. With `on`, each bullet after it at its level
   follows as a slide of its own; the ones before it stay out.
   Slide layouts (#433): each slide is drawn as slideLayout says. A plain
   top line is a slide of its own after the title, in order. A layout with
   more lines than fit goes on as "Title (2/2)". In a 2D layout (versus, hub,
   2×2, scorecard, cards, quote) a line's own lines are drawn in its box, so
   only their own lines get a slide; `breadcrumb` says where a slide is from.
   `parts` are what → lights, one each: the lines, or a quote's takeaways.
   A task line or a "_ " line is left out with its lines (#467); `hidden`
   counts them for the presenter. The bullet you present from always shows.
   `pics` are the parts' own notepad pictures, shown while each is lit (#464). */
function deckSteps(path, root = null, on = false) {
  const page = getPage(path);
  const steps = [], slides = [], left = new Set();
  // A line that is only a picture has something to show too: a map's card (#488).
  const words = b => !!(slideWords(b) || slidePicture(b.title || "") || (b.children || []).some(words));
  const shown = b => {
    // The waiting screen's slides are not in the talk (#486).
    if (SLIDE_WAIT_RE.test(b.title || "")) return false;
    if (!words(b)) return false;
    if (slideHidden(b)) { left.add(b); return false; }
    return true;
  };
  const kidsOf = b => (b.children || []).filter(shown);
  const has = b => kidsOf(b).length > 0;
  /* The layout word on the slide's own line (#481); not on a table's slide,
     whose one line is the table. `word` given: the bullet presented from. */
  const slide = (block, head, kids, depth, up, breadcrumb, notes, word) => {
    if (word === undefined) word = block && !(kids.length === 1 && kids[0] === block) ? slideWord(block.title).layout : null;
    const lay = slideLayout({title: head, word}, kids);
    const pages = slidePages(kids, lay.max);
    pages.forEach((chunk, p) => {
      const hero = lay.layout === "hero" ? slideHero(chunk[0]) : null;
      // `home` keeps the slide's own places (#487): its line, the bullet presented from, or the page.
      const s = {n: slides.length + 1, block, depth, up, breadcrumb, kids: chunk, path, home: block || root || null,
        // A map's title has its picture in it (#488): the picture goes behind, the words stay.
        title: (lay.layout === "map" ? trim(lay.title.replace(/![[^]]*]([^)]*)/g, "")) : lay.title) + (pages.length > 1 ? ` (${p + 1}/${pages.length})` : ""),
        layout: lay.layout, mode: lay.mode, axes: lay.axes, guess: lay.guess, hero,
        parts: lay.layout === "map" ? slideMapItems(chunk).map(i => i.block) : hero ? [chunk[0], ...hero.takeaways] : lay.layout === "table" ? slideTableParts(chunk[0])
          // A chart of a table lights a row at a time (#482).
          : SLIDE_CHARTS.includes(lay.layout) && tableRows(chunk[0]) ? slideTableParts(chunk[0], true) : chunk, first: steps.length,
        ...(notes || (block ? slideNotes(block) : {cover: "", notes: ""}))};
      // A part's own notepad picture is shown in the cover's place while that part is lit (#464).
      s.pics = s.parts.map(p => p && typeof p === "object" ? slideNotes(p).cover : "");
      // A map's own picture is behind the whole slide (#488); its cards' pictures are their own.
      if (lay.layout === "map") { s.cover = slidePicture(block?.title || "") || slidePicture(head) || s.cover; s.pics = []; s.map = slideMapItems(chunk); }
      slides.push(s);
      steps.push({s, k: 0});
      s.parts.forEach((part, i) => {
        if (lay.mode === "1d" && has(part)) return slide(part, slideWords(part), kidsOf(part), depth + 1, s, lay.title);
        // A table among a slide's lines comes as a slide of its own in its turn (#469).
        if (lay.mode === "1d" && lay.layout !== "table" && tableRows(part)) return slide(part, lay.title, [part], depth + 1, s, "");
        steps.push({s, k: i + 1});
        if (lay.mode === "1d") return;
        const crumb = lay.title + " > " + slideWords(hero ? chunk[0] : part);
        for (const l2 of hero ? (i ? [part] : []) : kidsOf(part))
          if (has(l2)) slide(l2, slideWords(l2), kidsOf(l2), depth + 1, s, crumb);
      });
      s.end = steps.length;
    });
  };
  const head = root ? slideWords(root) : pageTitle(path);
  const top = ((root ? root.children : page?.blocks) || []).filter(shown);
  const notes = root ? slideNotes(root) : null;
  /* The page keeps the outline's order (reopened #431). A bullet presented
     from here is one slide: its lines come in their turn, and one with lines
     of its own goes into them then. So is a page drawn whole by its title (a
     versus, a 2×2, a grid). Else the title is a slide alone and each top line
     follows as a slide of its own; one with no lines shows big and centered,
     as a title does. Marked lines next to each other stay one drawing (a
     timeline, steps…), as do plain lines a scorecard draws; the first drawing
     is the title slide's own, so the title is not shown twice. */
  if (root || slideTitleTokens(head).layout || slideLayout({title: head}, top).mode === "2d") {
    slide(null, head, top, 0, null, "", notes, root ? slideWord(root.title).layout : null);
  } else {
    // A top line that is a table is drawn alone, under the page's title (#469).
    const kind = b => slideMark(b.title).layout ? "mark" : has(b) || tableRows(b) ? "own" : "flat";
    const runs = [];
    for (const b of top) {
      const run = runs.at(-1);
      if (run && kind(b) !== "own" && kind(run[0]) === kind(b)) run.push(b); else runs.push([b]);
    }
    const drawn = run => kind(run[0]) !== "own" && slideLayout({title: head}, run).layout !== "list";
    const first = runs.length > 0 && drawn(runs[0]);
    slide(null, head, first ? runs[0] : [], 0, null, "", notes);
    for (const run of runs.slice(first ? 1 : 0)) {
      if (drawn(run)) slide(null, head, run, 0, null, "");
      // A top line's slide names the page as its breadcrumb; the page title rises into it (#431).
      else for (const b of run) tableRows(b) ? slide(b, head, [b], 0, null, "") : slide(b, slideWords(b), kidsOf(b), 0, null, head);
    }
  }
  if (root && on) {
    const sibs = root._parent ? root._parent.children : page?.blocks || [];
    for (const b of sibs.slice(sibs.indexOf(root) + 1).filter(shown)) slide(b, slideWords(b), kidsOf(b), 0, null, "");
  }
  return {steps, slides, hidden: left.size};
}
