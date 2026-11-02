async function seedIfEmpty() {
  // An area whose folder came back empty is not new; seeding it is what made it look new.
  if (LOADED.get(V.space)?.hold) return;
  /* Nor is one whose folder only wants its permission again, as it does after
     a fresh download: browser storage stands in until then, and starter verbs
     and templates seeded there were laid over the folder's own on reconnect. */
  if (folderMissing(V.space)) return;
  const hadPages = V.pages.size > 0;
  ensureDefaultTemplates();
  scheduleTemplateRefresh();
  ensureCircleOrgs();
  if (hadPages) return;

  for (const [lang, verbs] of Object.entries(SEED_VERBS)) {
    for (const [canonical, syns] of Object.entries(verbs)) {
      putPage(join(DIRS.verbs, lang, canonical + ".md"), {
        props: {title: canonical, type: "verb", lang},
        blocks: [
          newBlock({title: canonical + " = " + canonical}),
          ...syns.map(s => newBlock({title: s + " = " + canonical})),
        ],
      });
    }
  }
  /* The page stencils live with the lists now, in pages/8/, and are looked up
     by name: "journals" shapes a day page, "1" shapes a new active project. */
  /* No headings in it. "Captured" and "Done today" were two empty bullets on
     every day page, and neither earned the line: capture writes to the page
     itself, ticking something off leaves it where it is, and the Today screen
     already shows both groupings from the tasks rather than from where they sit
     in the file. What they actually did was put two bullets you had to read
     past at the top of every new day, and indent anything you typed under the
     wrong one. The stencil stays -- its title:: and created:: still shape the
     day, and anybody who does want a shape for their day can write it here. */

  settingsPage();
  setSetting("last_review", "");

  // cadence:: makes this a routine rather than a plain checklist, which is what
  // it actually is -- it comes round again every week and never finishes. It also
  // means the one list everybody starts with demonstrates the distinction.
  // The built-in list, in David Allen's three parts: get clear, current, creative.
  const review = reviewListPage();
  review.props.type = "checklist";
  putPage(REVIEW_LIST_PATH, review);

  // Verbs, templates and settings belong to every space. The first project
  // only makes sense in the first one -- a second space is somebody who has
  // already met the app.
  if (PREF.get("welcomed")) { scanVerbs(); return; }
  PREF.set("welcomed", todayISO());

  // No demo tasks and no demo journal: nobody wants to start by deleting a
  // stranger's shopping list. The one thing seeded is the tour, and it is a
  // real project whose steps are doors into the parts of the app you would
  // otherwise never find -- see 113d.
  seedTourProject();
  scanVerbs();
}
