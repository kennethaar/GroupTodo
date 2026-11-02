function emailOf(name, space) {
  if (!trim(name)) return "";
  return inSpace(space, () => {
    const path = personPath(name);
    if (!V.pages.has(path)) return "";
    const props = getPage(path).props || {};
    return trim(props[EMAIL_PROP] || props["e-mail"] || "");
  });
}
