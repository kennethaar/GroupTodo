/* The responsibilities somebody is a stakeholder in, in every area on screen:
   {space, path, title, told, since}. since is what "done since" counts from:
   when they were last told, else one of their rhythm back. */
function stakeIn(to) {
  return acrossSpaces(() => areaList().filter(p => stakeholdersOfArea(p).some(s => sameStake(s, to))).map(path => {
    const told = toldOn(path, to);
    return {path, title: pageTitle(path), told, since: told || shiftISO(todayISO(), -(updateEveryDays(to) || 30))};
  })).map(a => Object.assign(a, {space: a.space || V.space}));
}
