const isMember = name =>
  !!name && members().some(m => samePerson(m.name, name));
/* A household person is a person page with household:: true: somebody at
   home who never opens GroupToDo -- a child, often a partner (#236). They
   take turns at the chores and get the points for them, and what is handed
   to them stays a task, because somebody in the house ticks it off for them.
   A member is never household as well: they tick off their own. */
const HOUSEHOLD_PROP = "household";
const isHouseholdPage = path => !isMemberPage(path) &&
  trim(String(getPage(path)?.props?.[HOUSEHOLD_PROP] || "")).toLowerCase() === "true";
