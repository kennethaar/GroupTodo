function unlinkPersonFromOrg(person, org) {
  const {space, path} = personPageAt(person);
  inSpace(space, () => {
    const page = getPage(path);
    for (const k of Object.keys(page?.props || {}))
      if (linksWith({[k]: page.props[k]}, "o/").some(x => x.toLowerCase() === org.toLowerCase()))
        removeLinkFromProp(space, path, k.toLowerCase(), "o/" + org);
  });
}
