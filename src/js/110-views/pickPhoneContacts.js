/* Pick from phone: Chrome on Android hands over the contacts you pick
   (Contact Picker API). Hidden where the browser cannot (#383). */
const canPickPhoneContacts = () => !!(navigator.contacts && typeof navigator.contacts.select === "function");
async function pickPhoneContacts() {
  let picked;
  try { picked = await navigator.contacts.select(["name", "tel", "email"], {multiple: true}); }
  catch (e) { notify("The phone did not hand over any contacts.", "warn"); return; }
  const cards = (picked || []).map(p => ({name: trim((p.name || [])[0] || ""), phone: (p.tel || []).map(trim).filter(Boolean),
    email: (p.email || []).map(trim).filter(Boolean), org: "", birthday: ""})).filter(c => c.name);
  if (cards.length) openVCardImport("", cards);
}
