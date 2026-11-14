(async function init() {
  let t = loadMark("GroupToDo " + APP_VERSION + " starting");
  await probeStorage();
  installManifest();
  installServiceWorker();
  installFileHandler();
  installAutoSync();
  await initSpaces();
  t = loadMark("storage and areas ready", t);

  const shown = storedVisible();
  let wanted = PREF.get("activeSpace");
  if (shown.length && (!wanted || !shown.includes(wanted))) wanted = shown[0];
  const start = (wanted && Spaces.get(wanted)) ? wanted : Spaces.list[0].name;
  try {
    await openSpace(start, null, {draw: false});   // drawn below, once (#231)
    t = loadMark("opened “" + start + "”", t);
  } catch (e) {
    notify("Could not open area: " + e.message, "warn");
    Spaces.active = start;
    await loadFromBackend(CAP.idb ? Backends.idb() : CAP.ls ? Backends.ls() : Backends.memory());
  }
  await seedIfEmpty();
  scanVerbs();
  topUpTrackerSeries();               // before today's page is made, so it gets them
  if (!folderWaiting(V.space)) ensureJournal(todayISO());
  t = loadMark("verbs, trackers and today's page made", t);
  ensureVisibleLoaded();            // the areas beside it come in behind the journal (#387)
  renderUnlessTyping();             // the day may be on screen already, and written in (#181)
  t = performance.now();
  await collectSharedFile();
  window.addEventListener("hashchange", () => handleHash());
  await handleHash();
  loadMark("start-up done; the rest of the folder follows", t);

  /* Set before any of the early returns below, and before the first dialog:
     the folder-reconnect offer in openSpace is gated on it, and somebody who
     arrives by invite switches spaces within seconds of opening the file. */
  INIT_DONE = true;
  /* Two spaces sharing or nesting one folder means one is reading the other's
     files, and joining a space is exactly when a second folder appears -- so
     this runs on every path, not only the one that reaches the bottom. */
  checkFolderConflicts();

  if (CAP.sandboxed) {
    // SharePoint and Teams will happily let you upload the app and then show
    // it inside <iframe sandbox srcdoc> with no allow-same-origin. The page
    // runs, so it looks like it worked, but it has an opaque origin: no
    // storage, no folder, not even a download. Nothing typed here survives,
    // so say so before any of it is typed.
    modal({
      center: true,
      title: "Nothing can be saved here",
      body: el("div", {},
        el("div", {class: "field"},
          el("div", {style: "font-size:13.5px"},
            "This page is running inside a locked preview frame, which is what SharePoint " +
            "and Teams do with an uploaded .html file. It has no storage of its own, cannot " +
            "open a folder, and cannot even save a file - so anything you type here is " +
            "gone the moment you close it.")),
        el("div", {class: "field"},
          el("label", {}, "Either of these works instead"),
          el("div", {style: "font-size:13px;color:var(--fg2)"},
            "\u2022 Download grouptodo.html and open it from your own computer. On Chrome or Edge " +
            "that gives you the full app and a real folder of .md files."),
          el("div", {style: "font-size:13px;color:var(--fg2);margin-top:6px"},
            "\u2022 Or put it on a web address and open that. A document library is file " +
            "storage, not a web host.")),
      ),
      foot: [el("button", {class: "btn primary", onclick: closeModal}, "I understand")],
    });
    return;                 // no onboarding: there is nothing here to onboard into
  }
  /* Not a notify when there is a dialog about to cover it: with no storage the
     onboarded flag cannot be written either, so the welcome screen comes back
     every reload and has to say why itself. */
  if (CAP.persist === "memory" && PREF.get("onboarded")) {
    notify("This browser will not store anything for this page. Use Vault & sync \u2192 " +
           "Save vault file before you close the tab.", "error");
  }

  installCalendarTimer();
  installPlannerTimer();
  installUsageLog();
  maybeSyncCalendars();              // held back until now: the folders are read in
  installMeetingReminders();
  scheduleContextPrompts();
  installSensing();
  expireOverdue();
  resumeHeldTasks();
  remindTick();
  setInterval(remindTick, 30000);
  if (updatesPossible()) { maybeShowWhatsNew(); installUpdateCheck(); }

  /* A file somebody baked for you answers every question onboarding would ask --
     but only once they have said yes. Turned down, the invite and the welcome
     screen are both still waiting. */
  if (await useBakedInvite()) { PREF.set("onboarded", todayISO()); return; }

  if (!PREF.get("onboarded")) { openOnboarding(); return; }

  if (spacesNeedingStorage().length) { openSpaceStorageSetup({firstRun: false}); return; }
  // A folder that came back empty comes before everything else that could write to it.
  const held = heldRecords();
  if (held.length) {
    showHoldDialog(held.some(r => r.name === Spaces.active) ? Spaces.active : held[0].name);
    setSync("warn", "not saving - folder looks empty");
    return;
  }
  // A remembered folder that only needs permission again: ask here, where it
  // is one click, instead of leaving a picker to be found in Vault & sync.
  // The area on screen asks in place of its pages (folderAwayPanel); a dialog on
  // top of that would be the same question twice.
  if (folderMissing(Spaces.active)) return;
  if (PENDING_GRANT.size || LOST_FOLDER.size) {
    offerFolderBack(Array.from(PENDING_GRANT.keys())[0] || Array.from(LOST_FOLDER)[0]);
    return;
  }
  // Last, so it never covers a question above: once per serve.py start (#357).
  if (CAP.served && SERVER_INFO && !document.querySelector("#modalRoot .modal")) maybeServeNotice(SERVER_INFO);
  afterFirstRun();
  offerLineDraft();
})();
