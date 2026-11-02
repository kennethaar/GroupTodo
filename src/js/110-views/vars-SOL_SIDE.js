const SOL_SIDE = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]};
window.addEventListener("keydown", e => {
  if (state.view !== "review" || !["projects", "actions"].includes(subNow())) return;
  if ($("#modalRoot").firstChild || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  // Backspace deals the last card again, also from the end of the pass.
  if (e.key === "Backspace" && !e.shiftKey && SOL.past && SOL.past.length && solSteps().length) {
    e.preventDefault(); e.stopImmediatePropagation(); SOL_KB = null; solUnpaint(); solBack(); return;
  }
  if (!document.querySelector(".sol")) return;
  const r = SOL.order && SOL.order[SOL.i];
  if (!r) return;
  if (SOL.moving) { e.preventDefault(); e.stopImmediatePropagation(); return; }
  const take = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  // By e.code, so the numpad means the same with NumLock on or off.
  const key = e.key, m = /^(?:Numpad|Digit)([1-9])$/.exec(e.code);
  const to = m ? (m[1] === "5" ? "CARD" : m[1]) : null;
  if (e.shiftKey && key === "ArrowRight") { take(); SOL_KB = null; solUnpaint(); solOp(r, "next"); return; }
  if (e.shiftKey) return;
  /* 5 is the project: once goes back to it, twice in a row skips it. The first
     press acts at once, so going back never waits to see if a second comes. */
  if (to === "CARD") {
    take();
    if (e.repeat) return;
    const now = Date.now(), twice = now - SOL_FIVE_AT < SOL_TWICE_MS;
    SOL_FIVE_AT = twice ? 0 : now;
    if (twice) { SOL_KB = null; solUnpaint(); solOp(r, "skip"); } else solKbClose();
    return;
  }
  if (to) {
    take(); SOL_FIVE_AT = 0;
    if (e.repeat) return;
    if (SOL_KB && SOL_KB.k === to) solKbTake(r); else solKbOpen(to);
    return;
  }
  // Letters only ever aim: they never move the card or take an answer.
  if (key.length === 1 && /\p{L}/u.test(key)) { take(); solKbType(key); return; }
  if (SOL_SIDE[key]) { take(); solKbMove(...SOL_SIDE[key]); return; }
  // Enter with nothing aimed at aims at the best answer: it never leaves the review.
  if (!SOL_KB && (key === "Enter" || key === " ") && e.target.closest?.(".sol .solopt, .soldeckpile") == null) {
    take(); solKbOpen(SOL_SPOTS.find(k => SOL_ACTS.has(k))); return;
  }
  if (!SOL_KB) return;
  if (key === "Escape") { take(); solKbClose(); return; }
  if (key === "Enter" || key === " ") { take(); solKbTake(r); }
}, true);

/* ---------- the someday pass: two at a time ----------
   Asking "should this become active?" of every someday project in turn is a
   hard question forty times over; "which of these two would you rather do?"
   is an easy one. So two are dealt side by side and played like a cup: winners
   meet winners, so the best has beaten only a handful on its way up, and only
   that handful then play for second place, and so on down to SD_TOP. Forty
   projects take about 55 choices the first time. Nobody needs to know which
   is 31st.

   Every choice is written to the area's GTD.md as someday_duels::, winner >
   loser and the day, so next week only new projects have to be placed. A
   choice older than SD_KEEP_DAYS is let go and that pair is asked again: what
   you would rather do changes.

   One area at a time, so work and home are never weighed against each other. */
const SD_TOP = 5, SD_KEEP_DAYS = 56;
let SD = {skipped: new Set(), keep: null, last: null, n: 0, going: false};
/* The same cup is played with the projects on hold with no date, in the pass
   before Someday: "which would you rather pick up first?". An open hold is a
   commitment without a start, and without a look now and then it becomes a
   drawer nobody opens. Its choices are kept as hold_duels::, the same way.
   A project is only ever in one of the two: someday ones on hold sit out the
   someday cup. */
const SD_KINDS = {
  someday: {setting: "someday_duels", pref: "sd.space", pass: () => SD_PASS,
    items: () => visibleProjects("2").filter(r => !inS(r, () => isTourProject(r.path) || projectHold(r.path))),
    count: "someday/maybe", ask: "Which would you rather do, if there were time this week?",
    how: "You are not deciding to start it now, only which of the two you would rather do.",
    none: ["Nothing in Someday/Maybe here.", "Projects put in Someday/Maybe come here, to be weighed two at a time."],
    one: "Only one project in Someday/Maybe.",
    done: "Activate one from the ranking, or leave them be. Next week only new projects need placing.",
    rankSay: "Settled by your choices, best first. Activate one to move it to Active projects.",
    act: "Activate", actTitle: "Move it to Active projects",
    take: r => inS(r, () => setProjectStatus(r.path, "1", {ask: false}))},
  hold: {setting: "hold_duels", pref: "hd.space", pass: () => HD_PASS,
    items: () => ["1", "3", "2"].flatMap(code => visibleProjects(code))
      .filter(r => !inS(r, () => isTourProject(r.path)) && solOpenHold(r)),
    count: "on hold, no date", ask: "Which would you rather pick up first?",
    how: "You are not taking it off hold now, only saying which of the two you would rather pick up first.",
    none: ["Nothing on hold without a date here.", "Projects put on hold with no date come here, to be weighed two at a time."],
    one: "Only one project on hold without a date.",
    done: "Take one off hold from the ranking, or leave them be. Next week only new ones need placing.",
    rankSay: "Settled by your choices, best first. Take one off hold and its actions are back on your lists.",
    act: "Take it off hold", actTitle: "Its actions are back on your lists at once; it keeps its status",
    take: r => inS(r, () => setProjectHold(r.path, null))},
};
const sdK = () => solPassNo() === HD_PASS ? SD_KINDS.hold : SD_KINDS.someday;
const sdSlug = r => baseName(r.path);
const sdPairKey = (a, b) => [a, b].sort().join("\n");
const sdFresh = x => (dateDiffDays(x.at, todayISO()) ?? 0) <= SD_KEEP_DAYS;
