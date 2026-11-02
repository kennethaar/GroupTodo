/* Asked once, right after joining, and skippable like any other prompt -- the
   coach strip keeps asking if it is left blank. */
function askJoinerName(space, from, after) {
  const ask = () => promptInput({
    title: "Who are you in " + space + "?",
    label: "Full name",
    value: whoAmI(),
    placeholder: "Kenneth Aar",
    cta: "Save",
    note: el("div", {class: "field"},
      el("div", {style: "color:var(--fg2);font-size:13px"},
        "Written into the files as by:: and done_by::, so " + (from || "everyone else here") +
        " can see what you added and what you closed. Two people called Kenneth is the day " +
        "you wish you had typed the surname. Leave it blank and nothing is stamped.")),
    onSave: n => { setIdentity(n, space); coachMark("who"); render(); },
  });
  // One dialog replaces another, so the folder question has to wait its turn.
  if (after) askAfterModal(() => { ask(); askAfterModal(after); });
  else ask();
}
