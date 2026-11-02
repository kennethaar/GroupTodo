const isMember = name =>
  !!name && members().some(m => samePerson(m.name, name));
