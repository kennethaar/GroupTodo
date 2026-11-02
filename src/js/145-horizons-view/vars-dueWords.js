/* A date says what it is: "Due yesterday", not "Yesterday" (#160). */
const dueWords = when => "Due " + when.replace(/^(Today|Tomorrow|Yesterday)\b/, w => w.toLowerCase());
