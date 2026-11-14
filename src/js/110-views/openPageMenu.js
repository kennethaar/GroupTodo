/* Everything you can do to a page that is not one of its values, in one menu
   behind the "..." beside its title, with the letters the other menus use. */
function openPageMenu(path) {
  const kind = pageKind(path), code = statusDirOf(path), space = V.space;
  chipMenu(pageTitle(path), path, lettered([
    code ? ["Add a next action", null, () => openAddNextAction(path)] : null,
    code ? [...npmLabel(space, path), () => npmOpen(space, path)] : null,
    code ? ["Mark reviewed", "runs the review rules on the page", () => { updateReviewed(path); render(); }] : null,
    isEmailPage(path) ? ["Reply", "an email to the sender, their words quoted", () => openMailNote(path, "reply")] : null,
    isEmailPage(path) ? ["Ask for news", "a short email asking how it stands", () => openMailNote(path, "ask")] : null,
    isEmailPage(path) ? ["Forward", "the email, to whoever you type", () => openMailNote(path, "forward")] : null,
    isEmailPage(path) ? ["Add their answer", "paste the reply; it goes on the page with today's date", () => openMailAnswer(path)] : null,
    isEmailPage(path) ? ["Plan it with an AI", "a prompt for your AI; its answer becomes a project", () => openPlanWithAI(planSourceOfEmail(path))] : null,
    kind === "checklist" && !isStateList(path) && !isWordList(path) ? [isProjectTemplate(path) ? "New project from this" : "Add this to a page", null, () => openRunChecklist(path)] : null,
    canSchedule(path) ? ["When it comes round", routineSummary(path), () => openRoutineSchedule(path)] : null,
    isPinned(path) ? ["Unpin from the sidebar", null, () => togglePin(path)]
                   : ["Pin to the sidebar", "as many pages as you like; drag them there to reorder", () => togglePin(path)],
    isSidePinned(space, path) ? ["Unpin from the right", null, unpinSide]
      : ["Pin to the right", "it stays open beside whatever you go to, for notes while you move about", () => pinToSide(space, path)],
    kind === "person" ? ["Share contact", "a .vcf the phone adds to its contacts", () => shareContact(path)] : null,
    isJournalPath(path) ? null : ["Share", "this page, without the rest of the area", () => openExportPage(path)],
    ["Copy linked references here", "every line that links to this page, copied to its bottom; the originals stay", () => copyLinkedRefs(path)],
    ["Copy path", "for somebody who shares the folder", () => copyPathTo(path)],
    ["Show in Explorer", "a line for Win+R that opens the folder with this file selected", () => revealInExplorer(path)],
    ["Where the folder is", "on this computer, for Show in Explorer", () => askDiskRoot(space)],
    V.backend && V.backend.openFile ? ["Open the file", "in the editor on the machine running the server", () => openSourceFile(path)] : null,
    [svgIcon(ICON_PENCIL), "the whole file as text", () => editAllText({space, path, id: null})],
    isJournalPath(path) ? null : ["Rename", "and the folder it is in", () => renamePrompt(path)],
    ["Move", "to another folder", () => movePrompt(path)],
    code ? ["Turn into a todo", "one line, with this page's lines under it", () => projectToTodo(path)] : null,
    code ? ["Turn into a responsibility", "Alt+I · new, or merged into one already there", () => projectToArea(path)] : null,
    Spaces.list.length > 1 ? ["Move to another area", "Alt+S", () => openItemSpacePicker({space, path})] : null,
    isJournalPath(path) ? null : ["Make private", "move it to an area the others cannot open", () => makePrivatePrompt(path)],
    isArchived(path) ? ["Unarchive", "its tasks count again", () => toggleArchived(path)]
                     : ["Archive", "kept, but its tasks leave the lists and search shows it last", () => toggleArchived(path)],
    ["Put back", putsBack(path) ? "on: lines refiled here can be put back; click to turn off" : "off: turn on to keep where refiled lines came from", () => togglePutBack(path)],
    dedupWritable(path) ? ["Remove duplicate lines", "a line written twice under the same parent goes; what was under it stays", () => removeDuplicateLines([path])] : null,
    ["Delete", null, () => deletePrompt(path)],
  ]));
}
