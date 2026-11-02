function unreadCount(block) {
  const set = readSet();
  const me = whoAmI();
  return messagesOf(block).filter(m => !samePerson(msgAuthor(m), me) && !set.has(msgKey(m))).length;
}
