/* A title that names the person who has the task shows the → pill in that
   name's place, rather than the name and then the same name again as a pill. */
function pillInTitle(titleEl, pill, who) {
  if (!pill || !who) return false;
  const link = [...titleEl.querySelectorAll(".wikilink[data-link]")]
    .find(n => samePerson(waitingPersonName(n.dataset.link), who));
  if (!link) return false;
  link.replaceWith(pill);
  return true;
}
