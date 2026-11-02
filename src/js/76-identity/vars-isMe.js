const isMe = name => !!trim(name || "") &&
  myNames().some(m => slugPerson(m).toLowerCase() === slugPerson(name).toLowerCase());
