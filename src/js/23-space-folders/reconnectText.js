/* The words for asking an area's folder back, the same in the panel and the
   dialog: "Reconnect folder 1 of 2: Work" when more than one waits. */
function reconnectText(name, label, where) {
  const step = folderAskStep(name);
  return {
    title: "Reconnect folder " + (step ? step + ": " : ": ") + label,
    body: "The browser asks on every refresh once per folder. Reconnect to “" + where + "”?",
  };
}
