/* ============================================================
   60_STATE_MACHINE
   Port of: init.lua set_org_state
     -> TODO : stamp "Added" (no context nudge: see below)
     -> DONE : close out the Added line with an end date + elapsed days,
               then check whether the project just ran out of next actions
   ============================================================ */

function setBlockState(path, block, state, opts = {}) {
  const snapshot=structuredClone(getPage(path)), space=V.space;
  pushUndo({
    run: () => {
      if (V.space !== space || !getPage(path)) return false;
      Object.assign(getPage(path), structuredClone(snapshot));
      touch(path);
      render();
      return true;
    },
  });
  const prev = block.state;
  block.state = state;
  if (opts.stage) writeStage(block, opts.stage.list, opts.stage.name); else { syncStage(block); state = block.state; }

  if (state) {
    if (!prev) applyTodoTemplate(block);
    if (prev !== state) runTemplateRules(block,"status",state);
    stampAddedIfMissing(path, block);
  }
  // Ticked off for somebody who takes turns: the credit is theirs (#236).
  if (state === "DONE" && prev !== "DONE" && choreDoer(block)) setDoneBy(block, choreDoer(block));
  /* Doing it is the clock running: started on DOING, stopped on whatever
     comes next -- Logseq's way, in its :LOGBOOK:, so it reads them too. */
  if (prev !== state) {
    if (state === "DOING") { if (clockOnDoing()) clockIn(block); }
    else if (prev === "DOING") clockOut(block);
  }
  touch(path);

  /* No context prompt here. A state change is you handling a task you are
     already looking at: starting it, parking it, un-ticking one you ticked by
     mistake. A context is for the opposite moment -- deciding, later, out of
     everything on the list, which few things you could do where you are. Being
     stopped and asked "where would you do this?" while your hand is literally
     on the task answers a question nobody asked, and it cost a dialog per
     click of the state pill.

     It is still asked where it belongs: Clarify walks verb then context, the
     "no context" chip on the row adds one in a click, capture asks as the line
     is written, and the weekly review lists every action that has none. Only
     the interruption is gone. See 160_CLARIFY and chipsFor(). */
  /* Ticked in Chores, a chore's next one is put in there and then, for
     whoever's turn it is: nothing to answer each time the bins go out. */
  const again = state === "DONE" && prev !== "DONE" && opts.nextNow && !opts.skipRepeat &&
    templateFeature(block, "repeat_prompt") && repeatOf(block) && (!isWeekPath(path) || isChoreBlock(block)) ? nextChoreNow(path, block) : null;
  /* The undo is found by the line's id, not the snapshot, so whatever else
     changed on the page since stays. */
  if (state === "DONE" && prev !== "DONE") {
    const id = block.id, was = prev || "TODO";
    const nextSays = () => again ? " · next " + humanDate(again.when) + (again.who ? ", " + firstNameOf(again.who) : "") : "";
    // A chore, with more than one to take turns: who did it can be changed.
    const credit = isChoreBlock(block) && choreCrew().length > 1 ? {label: plainTitle(block.title),
      who: closedBy(block) || whoAmI(), set: who => {
        if (!recreditChore(space, id, who, again)) return;
        credit.who = who;
        render();
        notify(firstNameOf(who) + " gets the points" + (again && again.who ? ". Next one: " + firstNameOf(again.who) + "." : "."));
      }} : null;
    offerDone({kind: "todo", space: V.space, path, title: block.title, credit,
      label: plainTitle(block.title) + nextSays(),
      day: todayISO(), at: Date.now(), undo: () => inSpace(space, () => {
        if (again) dropBlockById(again.copy.id);
        const f = findBlock(id);
        if (f && f.block.state === "DONE") setBlockState(f.path, f.block, was);
      })});
  }
  if (state === "DONE" || state === "CANCELLED") {
    if (prev !== state) noteTodoTouched();
    // Asked, never assumed, and only on the tick that actually finished it.
    // On a week page the next one comes with next week's page -- except a
    // chore's, which is put on the page for its day or week (#212).
    if (state === "DONE" && prev !== "DONE" && templateFeature(block,"repeat_prompt") && repeatOf(block) && !opts.skipRepeat && !again &&
        (!isWeekPath(path) || isChoreBlock(block))) {
      render();
      offerNextOccurrence(path, block);
      return;
    }
    // Closing the last open step of a project leaves it with no next action,
    // whether the step was on the project page or in a day page naming it.
    if (prev !== state && OPEN_STATES[prev]) {
      const proj = projectOfBlock(path, block);
      if (proj) { render(); checkProjectCompletion(proj); return; }
    }
  }
  render();
}
