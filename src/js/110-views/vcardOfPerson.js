/* What a person's page says that a phone's address book keeps too: phones,
   emails, organisation and birthday (#383). The keys are the ones people
   write -- phone:: or mobile::, email:: or mail:: -- and a page may hold
   several numbers in one value, split by commas. */
function vcardOfPerson(path) {
  const props = getPage(path)?.props || {};
  const split = v => String(v || "").split(/\s*[,;]\s*/).map(trim).filter(Boolean);
  const keyed = re => Object.keys(props).filter(k => re.test(k.toLowerCase()));
  const org = linksWith(props, "o/")[0] ||
    trim(String(props[keyed(/^(org|organisation|organization)$/)[0]] || "").replace(/\[\[|\]\]/g, ""));
  return {
    name: pageTitle(path),
    phone: keyed(VCARD_PHONE_KEY).flatMap(k => split(props[k])),
    email: keyed(VCARD_EMAIL_KEY).flatMap(k => split(props[k]).map(bareAddress)).filter(Boolean),
    org: org || "",
    birthday: trim(birthdayIn(props)),
  };
}
