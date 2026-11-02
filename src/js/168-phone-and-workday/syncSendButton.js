function syncSendButton() {
  const b = $("#btnSend");
  if (!b) return;
  b.hidden = !phoneLike();
  b.classList.toggle("dot", unsentEdits());
  b.title = unsentEdits() ? "You have changes the vault file has not carried yet" : "Send the vault file";
  $("#spacesBtn")?.classList.toggle("unsent", phoneLike() && unsentEdits());
}
