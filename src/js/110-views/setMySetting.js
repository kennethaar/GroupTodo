function setMySetting(key, val) {
  const me = whoAmI(), page = me && getPage(personPath(me));
  val = trim(val || "");
  if (page) {
    page.props = page.props || {};
    if (val) page.props[key] = val; else delete page.props[key];
    touch(personPath(me));
  } else PREF.set(key, val);
}
