const birthdayWhen = n => (n.age ? "turns " + n.age + " " : "") +
  (n.days === 0 ? "today" : n.days === 1 ? "tomorrow" : "on " + humanDate(n.iso));
