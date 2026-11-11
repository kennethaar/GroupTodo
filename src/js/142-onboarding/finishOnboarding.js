/* Either path ends here. Only the area this screen is about is marked as
   asked: one left over from an earlier install has its own answer coming, in
   context. Awaited, because a tab closed in the next moment would otherwise
   lose the flag and open the folder dialog on the second run.
   returning: somebody who has used GroupToDo before needs no getting-started
   guide (#356). */
async function finishOnboarding({returning = false} = {}) {
  PREF.set("onboarded", todayISO());
  PREF.set("coach", returning ? "0" : "1");
  const here = Spaces.get(Spaces.active);
  if (here) here.askedStorage = true;
  await Spaces.save();
  return here;
}
