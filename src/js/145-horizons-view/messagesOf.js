function messagesOf(block) {
  return (block.children || []).filter(isMessage)
    .sort((a, b) => msgAt(a).localeCompare(msgAt(b)));
}
