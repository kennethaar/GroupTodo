/* One person at one organisation, on a card. Said on the person's own page, it
   comes off with the cross; given by the page's name or the organisation's
   page, it is undone there. */
const worksAtStake = (person, org, face, label) => saysWorksAt(person, org)
  ? stake(label, face, () => unlinkPersonFromOrg(person, org))
  : el("span", {class: "stake inh", title: "From the page's name or " + org + "'s own page"}, face, label);
