function choreDoer(block) {
  const who = assigneeOf(block);
  if (!who || samePerson(who, whoAmI())) return "";
  return isHousehold(who) || (isChoreBlock(block) && isMember(who)) ? who : "";
}
