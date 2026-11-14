/* Share contact, on a person's page: the phone's share sheet opens Add
   contact; anywhere else the .vcf lands in your downloads (#383). */
async function shareContact(path) {
  const how = await sendFileOut(slugify(pageTitle(path)) + ".vcf", personVCard(path), "text/vcard", {title: pageTitle(path)});
  if (how === "saved") notify(pageTitle(path) + ".vcf is in your downloads.");
}
