/* Tell Emma, or Tell them: one button wherever a finished thing is shown (#402). */
function tellDoneButton(e, before = () => {}) {
  const who = doneStakeholders(e);
  if (!who.length) return null;
  return el("button", {class: "btn sm ghost", title: "Tell " + who.map(s => s.name).join(", ") + " it is done",
    onclick: () => { before(); openDoneNote(e); }}, who.length === 1 ? "Tell " + firstNameOf(who[0].name) : "Tell them");
}
