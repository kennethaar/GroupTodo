/* One round for one area: take in the flow's answer, then send what changed.
   The reading and writing are awaited outside inSpace(), which only holds V
   for synchronous work. */
async function plannerSync(area, {force = false} = {}) {
  const rec = LOADED.get(area);
  const b = rec && rec.backend;
  if (!b || b.kind !== "fs" || !b.readText || rec.hold || READING.has(area)) return;
  if (PLANNER_BUSY.has(area)) return;
  PLANNER_BUSY.add(area);
  try {
    const [outTxt, stateTxt, sentTxt] = await Promise.all([PLANNER_OUTBOX, PLANNER_STATE, PLANNER_SENT].map(p => b.readText(p)));
    const outbox = plannerJson(outTxt), sent = plannerJson(sentTxt) || {applied: 0, cards: {}};
    let state = plannerJson(stateTxt);
    // The flow stops at the first step without a state file, so the app starts one.
    if (!state) { state = {applied: 0}; await b.write(PLANNER_STATE, JSON.stringify(state, null, 2) + "\n"); }

    let sentChanged = false;
    if (outbox && state.applied === outbox.seq && (sent.applied || 0) < outbox.seq) {
      inSpace(area, () => plannerConfirm(outbox, state, sent));
      sentChanged = true;
    }
    if (state.error) plannerSay(area, "warn", "The flow said: " + String(state.error).slice(0, 300));

    const pending = outbox && state.applied !== outbox.seq && (outbox.tasks || []).length;
    const minutes = outbox ? (Date.now() - Date.parse(outbox.written || 0)) / 60000 : Infinity;
    if (pending && !force && minutes < PLANNER_STALE_MIN) {
      if (sentChanged) await b.write(PLANNER_SENT, JSON.stringify(sent, null, 2) + "\n");
      plannerSay(area, "wait", (outbox.tasks.length === 1 ? "1 card" : outbox.tasks.length + " cards") +
        " waiting for the flow, sent " + Math.round(minutes) + " min ago.");
      return;
    }
    const seq = Math.max(outbox?.seq || 0, state.applied || 0, sent.applied || 0) + 1;
    const {outbox: next, missing} = inSpace(area, () => buildPlannerOutbox(sent, seq));
    if (sentChanged) await b.write(PLANNER_SENT, JSON.stringify(sent, null, 2) + "\n");
    const more = missing.length ? " No email:: for " + missing.join(", ") + ", so not assigned." : "";
    if (!next.tasks.length) {
      if (!pending) { plannerSay(area, "ok", "Planner is up to date." + more); return; }
      // Nothing changed, but the last outbox was never answered: send it again as it was.
      next.tasks = outbox.tasks;
    }
    await b.write(PLANNER_OUTBOX, JSON.stringify(next, null, 2) + "\n");
    plannerSay(area, pending ? "warn" : "wait",
      (pending ? "The flow did not answer for " + Math.round(minutes) + " min, so it was sent again. " : "") +
      (next.tasks.length === 1 ? "1 card" : next.tasks.length + " cards") + " sent to the flow." + more);
  } catch (e) {
    plannerSay(area, "error", "Could not write to the planner folder: " + (e && e.message || e));
  } finally {
    PLANNER_BUSY.delete(area);
  }
}
