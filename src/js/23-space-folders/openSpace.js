async function openSpace(name, destination = null, {draw = true} = {}) {
  const sp = Spaces.get(name);
  if (!sp) { notify("No such area: " + name, "error"); return; }
  const editor=document.activeElement;
  if (editor?.isContentEditable || /^(INPUT|TEXTAREA)$/.test(editor?.tagName || '')) editor.blur();
  SPACE_TRANSITION = true;
  showNavigationLoading(destination?.pagePath ? 'Opening page...' : 'Opening area...');
  try {
  if (Spaces.active) await flush();     // drain before the backend changes underneath
  await Spaces.writeSummary().catch(() => {});

  Spaces.active = name;
  PREF.set("activeSpace", name);
  // Opening a space always shows it. If you were looking at a single space,
  // switching replaces it; if you were looking at several, it joins them.
  const shownNow = storedVisible();
  if (shownNow.length && !shownNow.includes(name)) {
    setVisibleSpaces(shownNow.length === 1 ? [name] : shownNow.concat([name]));
  }
  LINKED = null;                                  // the linked vault file is per space
  try { LINKED = (await IDB.get("kv", "bundle:" + name)) || null; } catch (_) {}

  let t = loadMark("“" + name + "”: opening");
  await loadFromBackend(await spaceBackend(sp), {quick: true});
  t = loadMark("“" + name + "”: first pages in", t);
  V.space = name;
  migrateVault();
  t = loadMark("“" + name + "”: pages brought up to date", t);
  await seedIfEmpty();             // a brand new space still needs verbs and templates
  storeAreaName(name);             // a name chosen before this was written down reaches the folder now
  scanVerbs();
  if (!folderWaiting(name)) ensureJournal(todayISO());
  state.context = getSetting("current_context") || null;
  if (!getSetting("started")) setSetting("started", todayISO());
  /* Answered in New space, before this vault existed to write it to. Never
     overwrites a profile the vault already carries. */
  if (PENDING_PROFILE.has(name)) {
    const want = PENDING_PROFILE.get(name);
    PENDING_PROFILE.delete(name);
    if (!getSetting("horizon_profile") && HORIZON_PROFILES[want]) setSetting("horizon_profile", want);
  }
  state.view = destination?.view || startView();
  state.pagePath = destination?.pagePath || null;
  if (destination) for (const key of NAV_FIELDS) if (key in destination) state[key]=destination[key];
  if (destination && "branch" in destination) applyBranchSnap(destination.branch);
  ensureVisibleLoaded();            // the areas beside it come in behind the journal (#387)
  SPACE_TRANSITION = false;
  if (draw) render();
  navRecord();
  await Spaces.writeSummary().catch(() => {});
  touchLastSeen();
  AUTOSYNC_AT = 0;                  // arriving in a space is worth one merge
  autoSyncLinked();
  checkClaimable();
  // At startup init() does this once, after everything else it opens.
  // A folder that is not there is asked for by folderAwayPanel, in place of the pages.
  if (INIT_DONE && !folderMissing(name)) {
    if (LOADED.get(name)?.hold) showHoldDialog(name);
    else offerLineDraft();
  }
  } catch (error) {
    SPACE_TRANSITION = false;
    const content = $("#content");
    if (content) {
      content.removeAttribute("aria-busy");
      content.replaceChildren(
        el("div", {class: "wrap", role: "alert"}, "Could not open the requested area. Please try again."),
      );
    }
    throw error;
  } finally { SPACE_TRANSITION = false; }
}
