function setEmailOf(name, space, email) {
  email = trim(email);
  if (!trim(name) || !looksLikeEmail(email) || email === emailOf(name, space)) return;
  inSpace(space, () => {
    const path = personPath(name);
    const page = V.pages.has(path) ? getPage(path) : {props: {title: name}, blocks: []};
    delete page.props["e-mail"];
    page.props[EMAIL_PROP] = email;
    putPage(path, page);
  });
}
