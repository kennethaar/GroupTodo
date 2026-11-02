// Somebody else's draft: theirs until you take it over.
const npmLocked = () => !!(NPM && NPM.by && whoAmI() && !samePerson(NPM.by, whoAmI()));
