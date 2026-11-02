const saysWorksAt = (person, org) => { const {space, path} = personPageAt(person);
  return inSpace(space, () => linksWith(getPage(path)?.props, "o/").some(o => o.toLowerCase() === org.toLowerCase())); };
