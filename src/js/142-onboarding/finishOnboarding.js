/* Either path ends here. Only the area this screen is about is marked as
   asked: one left over from an earlier install has its own answer coming, in
   context. Awaited, because a tab closed in the next moment would otherwise
   lose the flag and open the folder dialog on the second run. */
async function finishOnboarding() {
  PREF.set("onboarded", todayISO());
  PREF.set("coach", "1");
  const here = Spaces.get(Spaces.active);
  if (here) here.askedStorage = true;
  await Spaces.save();
  return here;
}
