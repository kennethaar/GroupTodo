/* Contacts to and from the phone, on People (#383): everyone here as one
   .vcf, and contacts brought in from a .vcf or, where the browser can, from
   the phone's own address book. */
function peopleContactActions() {
  const n = allPages(q => pageKind(q) === "person").length;
  const add = () => canPickPhoneContacts()
    ? chipMenu("Import contacts", "Pick a letter", lettered([
        ["Import .vcf file", "from the phone, Outlook or Google Contacts", pickVCardFile],
        ["Pick from phone", "the contacts you choose on this phone", pickPhoneContacts]]))
    : pickVCardFile();
  return [
    el("button", {class: "textbtn", title: "Bring in people from a .vcf file", onclick: add}, "Import contacts"),
    n ? el("button", {class: "textbtn", title: "Everyone with a page in this area, as one file for a phone or Outlook",
      onclick: () => exportPeopleVCards()}, "Export " + n + (n === 1 ? " person" : " people") + " (.vcf)") : null,
  ].filter(Boolean);
}
