function setDialogueStyle(k) {
  const page = bookPage();
  if (DIALOGUE[k]) page.props.dialogue = k; else delete page.props.dialogue;
  saveBook();
}
