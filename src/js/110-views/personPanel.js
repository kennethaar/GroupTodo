/* A person's page says what they are carrying, and for somebody outside the
   space, the way to ask them about it -- the only way their list ever gets
   shorter is you asking. Their lists are GTD's two for a person: what you are
   waiting for from them (what they are doing, for somebody in the area), and
   the agenda, your own tasks that name them, which is what to raise next time
   you talk. A line that is both is shown once, under what you wait for. */
function personPanel(name, path) {
  const mine = samePerson(name, whoAmI());
  const open = openActionsOf(name);
  const agenda = mine ? [] : askingAbout(name).filter(a => !open.some(w => w.block === a.block));
  const seen = lastSeenOf(name);
  const box = el("div", {class: "section"});
  box.append(el("div", {class: "personhead"}, avatarNode(name, 48),
    el("div", {style: "min-width:0;flex:1"},
      el("div", {class: "sub"}, mine ? "This is you." : isMember(name) ? "In this area" + (seen ? " · last seen " + seen : "")
        : "Not using this area, so everything with their name on it is something you are waiting for."),
      mine ? null : el("div", {class: "acts"},
        isMember(name) ? null : el("button", {class: "btn sm" + (open.length + agenda.length ? " primary" : " ghost"),
          onclick: () => openAskForUpdate(name)}, "Ask " + firstNameOf(name) + " for an update"),
        informAbout({name}).length || stakeIn({name}).length ? el("button", {class: "btn sm ghost",
          onclick: () => openSendUpdate({name})}, "Send " + firstNameOf(name) + " an update") : null,
        el("button", {class: "btn sm ghost", onclick: () => importUpdateFromFile()}, "Import a reply"),
        el("button", {class: "btn sm ghost", onclick: () => importUpdatePasted()}, "Paste a reply")))));
  if (path) box.append(personWorksAt(name, path));
  if (!mine) box.append(el("div", {class: "section"}, stakeholderLine({name})));
  const first = firstNameOf(name);
  box.append(mine || isMember(name)
    ? section("Next actions", open.length, taskCard(open, mine ? "Nothing on your plate." : "Nothing on " + first + "'s plate."))
    : section("Waiting for", open.length, taskCard(open, "Not waiting for anything from " + first + ".")));
  if (agenda.length) box.append(section("Agenda", agenda.length, taskCard(agenda, ""),
    el("span", {class: "h3aside", title: "Your own tasks that name " + first + ": things to raise next time you talk"}, "to raise with " + first)));
  return box;
}
