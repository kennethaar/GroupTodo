function openHelp(id) {
  go("help", {helpTopic: HELP[id] ? id : "start"});
}
