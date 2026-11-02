// The people a line names, and whoever it is assigned to, leaving you out.
function linePeople(block) {
  const names = linksIn(block.title).map(l => trim(l.split("][")[0]))
    .filter(l => /^p\//i.test(l)).map(l => trim(l.slice(2)));
  const who = assigneeOf(block);
  if (who) names.unshift(who);
  return names.filter((n, i) => !samePerson(n, whoAmI()) && names.findIndex(m => samePerson(m, n)) === i);
}
