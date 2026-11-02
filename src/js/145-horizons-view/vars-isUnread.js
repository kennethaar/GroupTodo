const isUnread = m => !samePerson(msgAuthor(m), whoAmI()) && !readSet().has(msgKey(m));
