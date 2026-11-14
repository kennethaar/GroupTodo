/* Everyone with a page in this area, as one .vcf file (#383). */
async function exportPeopleVCards() {
  const people = allPages(q => pageKind(q) === "person").sort((a, b) => pageTitle(a).localeCompare(pageTitle(b)));
  if (!people.length) { notify("No one in this area has a page yet."); return; }
  const name = slugify("People " + (V.space || "")) + ".vcf";
  const how = await sendFileOut(name, people.map(personVCard).join(""), "text/vcard", {title: "People"});
  if (how === "saved") notify(people.length + (people.length === 1 ? " person" : " people") + " saved to " + name + " in your downloads.");
}
