/* A person as the people reading the card need them, not as a link: the
   name, where they work and how to reach them --
   Nora Eklund, Harbour Bakery AS (nora@harbourbakery.example). */
function plannerPerson(name) {
  name = trim(name || "");
  if (!name) return "";
  const org = personOrgs(name)[0];
  const orgName = org ? pageTitle(findExistingPage("o/" + org) || "") || org : "";
  const mail = emailOf(name, V.space);
  return personBareName(name) + (orgName ? ", " + orgName : "") + (looksLikeEmail(mail) ? " (" + mail + ")" : "");
}
