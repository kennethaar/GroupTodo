/* Somebody in the area has a page to go and look at; somebody outside it gets
   asked, with one file they tick off and send back. */
const personActionBtn = (name, member) => el("button", {class: "textbtn",
  title: member ? "" : "One file they tick off and send back",
  onclick: e => { e.stopPropagation(); member ? openPersonPage(name) : openAskForUpdate(name); }},
  member ? "Open their page" : "Ask for an update");
const personAction = r => r.me ? null : personActionBtn(r.name, r.member || r.household);
/* What came back from somebody you asked, wherever you are waiting on them. */
const replyActions = () => [
  el("button", {class: "textbtn", title: "A reply file somebody sent back", onclick: () => importUpdateFromFile()}, "Import a reply"),
  el("button", {class: "textbtn", onclick: () => importUpdatePasted()}, "Paste a reply")];
