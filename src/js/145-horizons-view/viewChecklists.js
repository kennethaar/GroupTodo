/* Kept in three named groups rather than one undifferentiated pile, because the
   difference between them is the one piece of filing that actually earns its
   keep: a routine sitting in the project list makes the project list look
   permanently unfinished. */
function viewChecklists() {
  const c = el("div", {class: "wrap"});
  c.append(vhead("Settings", "Checklists you run, the words your lines use, and how the app looks.",
    newBtn("checklist", () => newChecklistPrompt())));
  // How the app looks first; the lists, which only grow, below.
  c.append(styleSection());
  c.append(sidebarSettingsSection());
  c.append(writingSettingsSection());
  c.append(helpSettingsSection());
  const cal = calendarSettingsSection();
  if (cal) c.append(cal);
  const lists = checklistPages();
  /* Two families (#405). A routine is a checklist with a rhythm and a template a
     checklist whose run makes a project, so they share one list, told apart by
     the chip. Task types and word lists are never run: they set what a line can
     hold, so they sit apart. */
  const isVocab = pth => isStateList(pth) || isWordList(pth);
  const GROUPS = [
    {label: "Checklists", test: pth => !isVocab(pth),
     blurb: "Steps you run. Run one when you need it, or give it a rhythm and it comes back. " +
            "A template makes a new project each time."},
    {label: "Line vocabularies", test: isVocab,
     blurb: "What a line can hold. A task type is the stages a task moves through - ordered, awaited, delivered; " +
            "Ctrl+Enter moves it on. A word list is the words offered on lines that start with its mark."},
  ];
  const iconOf = pth => isProjectTemplate(pth) ? "\u221e" : isStateList(pth) ? "\u2630" : isWordList(pth) ? "\u2261"
    : isRoutine(pth) ? "\u21bb" : "\u2611";
  /* The weekly review is a routine like the others, and the one everybody has,
     so it is always here -- as the built-in steps until you edit it. */
  const steps = reviewSteps().reduce((k, g) => k + g.steps.length, 0);
  c.append(section("The weekly review", null, el("div", {class: "card"},
    el("div", {class: "listblurb"}, "The steps the weekly review walks you through. Add your own, reword or drop any."),
    el("div", {class: "prow"},
      el("span", {class: "st st-2"}, svgIcon(ICON_REPEAT)),
      el("button", {class: "nm", style: "text-align:left", onclick: editReviewSteps}, "Weekly review"),
      el("span", {class: "chip"}, "weekly"),
      el("span", {class: "sub"}, steps + " steps" + (ownReviewList() ? "" : ", built in")),
      el("button", {class: "btn sm ghost", onclick: editReviewSteps}, "Edit steps"),
      el("button", {class: "btn sm primary", onclick: () => go("review", {sub: "steps"})}, "Review")))));
  lists.splice(0, lists.length, ...lists.filter(p => p !== REVIEW_LIST_PATH && p !== ASK_OWN_PATH && p !== INFORM_OWN_PATH && p !== FEELINGS_PATH));
  // The words around an update sheet: a page of its own kind, not a list you run.
  const editAskOwn = () => openPage(ensureAskOwn());
  c.append(section("The update note", null, el("div", {class: "card"},
    el("div", {class: "listblurb"}, "The words around the list when you ask for an update, and when you send one. " +
      "Make them more your own, or write them in another language, and pick Personalize text when you send."),
    el("div", {class: "prow"},
      el("span", {class: "st st-2"}, svgIcon(ICON_MAIL)),
      el("button", {class: "nm", style: "text-align:left", onclick: editAskOwn}, "Update note"),
      el("span", {class: "sub"}, V.pages.has(ASK_OWN_PATH) ? "personalized" : "built in"),
      el("button", {class: "btn sm ghost", onclick: editAskOwn}, "Edit text")),
    el("div", {class: "prow"},
      el("span", {class: "st st-2"}, svgIcon(ICON_MAIL)),
      el("button", {class: "nm", style: "text-align:left", onclick: () => openPage(ensureInformOwn())}, "Inform note"),
      el("span", {class: "sub"}, V.pages.has(INFORM_OWN_PATH) ? "personalized" : "built in"),
      el("button", {class: "btn sm ghost", onclick: () => openPage(ensureInformOwn())}, "Edit text")))));
  // The words a = line offers: the Feelings Wheel until you make them your own (#214).
  const editFeelings = () => openPage(ensureFeelings());
  c.append(section("Feelings", null, el("div", {class: "card"},
    el("div", {class: "listblurb"}, "The words offered as you type a feeling on a = line, from a broad feeling to a closer one. " +
      "Add your own, or write them in another language."),
    el("div", {class: "prow"},
      el("span", {class: "st st-2"}, "="),
      el("button", {class: "nm", style: "text-align:left", onclick: editFeelings}, "Feelings"),
      el("span", {class: "sub"}, V.pages.has(FEELINGS_PATH) ? "your own" : "Feelings Wheel, built in"),
      el("button", {class: "btn sm ghost", onclick: editFeelings}, "Edit words")))));

  // Empty, the three descriptions ARE the content: this is the one screen where
  // the difference between them is worth a paragraph.
  if (!lists.length) {
    const card = el("div", {class: "card"});
    card.append(el("div", {class: "empty", style: "text-align:left"},
      ...GROUPS.map(g => el("div", {style: "margin:8px 0"},
        el("div", {}, g.label),
        el("div", {style: "color:var(--fg3);font-size:12.5px;line-height:1.5"}, g.blurb)))));
    c.append(section("Checklists and vocabularies", null, card));
    return c;
  }

  const f = textFilter("checklists", "Filter checklists and vocabularies", lists, pth => pageTitle(pth) + " " + pth, (hits, q) => {
    const out = [];
    for (const g of GROUPS) {
      const mine = hits.filter(g.test).sort((x, y) => isProjectTemplate(x) - isProjectTemplate(y));
      if (!mine.length) continue;
      const card = el("div", {class: "card"});
      card.append(el("div", {class: "listblurb"}, g.blurb));
      for (const pth of mine) {
        const items = flattenBlocks(getPage(pth).blocks).length;
        const cta = isVocab(pth) ? "Open" : isProjectTemplate(pth) ? "New project" : "Run";
        card.append(el("div", {class: "prow"},
          el("span", {class: "st " + (isProjectTemplate(pth) ? "st-1" : "st-2")}, iconOf(pth)),
          el("button", {class: "nm", style: "text-align:left", onclick: () => openPage(pth)}, pageTitle(pth)),
          canSchedule(pth) ? el("button", {class: "chip", title: "When it comes round", onclick: () => openRoutineSchedule(pth)}, routineSummary(pth))
            : isProjectTemplate(pth) ? el("span", {class: "chip"}, "new project")
            : isRoutine(pth) && !isStateList(pth) ? el("span", {class: "chip"}, cadenceOf(pth)) : null,
          el("span", {class: "sub"}, isStateList(pth) ? stagesOf(pth).map(s => s.name).join(" \u2192 ")
            : isWordList(pth) ? "on " + (trim(getPage(pth).props.lines || "") || "no") + " lines"
            : items + (items === 1 ? " step" : " steps")),
          el("button", {class: "btn sm primary", onclick: () => isVocab(pth) ? openPage(pth) : openRunChecklist(pth)}, cta)));
      }
      out.push(section(g.label, mine.length, card));
    }
    return out.length ? out : emptyCard(noMatch(q, "Nothing here yet."));
  });
  c.append(el("div", {class: "fbar", style: "margin-top:20px"}, f.input), f.host);
  return c;
}
