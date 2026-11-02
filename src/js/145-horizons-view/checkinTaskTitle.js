function checkinTaskTitle(title, recipient) {
  let text = askUntagged(title);
  for (const name of [recipient, recipient.split(" ")[0]]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)) {
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp("(?:\\s*[-,:]\\s*)?\\b" + safe + "\\b\\s*$", "i"), "");
  }
  return trim(text.replace(/[,:-]+\s*$/, ""));
}
