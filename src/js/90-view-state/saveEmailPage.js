/* The page and the sender's page (with their address, for the next time).
   Hands back what it made, so "Keep the lines" can take it away; the line
   that links it is the paste's to put in. */
function saveEmailPage(mail) {
  const made = [];
  const person = mail.name && !mail.name.includes("@") ? slugify(mail.name).replace(/[\[\]#|]/g, "-") : "";
  if (person && !findExistingPage("p/" + person)) {
    const p = personPath(person);
    putPage(p, pageTemplateFor("p", person));
    made.push(p);
  }
  if (person && mail.email) setEmailOf(person, Spaces.active || "", mail.email);

  const {name, path} = freePageName(DIRS.mail, mail.subject, "Email");
  const props = {title: mail.subject, type: "email", from: person ? "[[p/" + person + "]]" : mail.name};
  if (mail.email) props[EMAIL_PROP] = mail.email;
  if (mail.to) props.to = mail.to;
  if (mail.sent) props.sent = /^\d{4}-\d{2}-\d{2}$/.test(mail.sent) ? "[[" + mail.sent + "]]" : mail.sent;
  const blocks = mail.body.filter(l => l).map(l => newBlock({title: l}, false));
  putPage(path, {props, blocks});
  touch(path);
  made.push(path);
  return {path, name, made};
}
