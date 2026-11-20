/* What is under a line in its notepad: your notes, and its first picture as
   the slide's cover. The audience sees the cover, never the notes. */
function slideNotes(b) {
  let cover = "";
  const notes = [];
  for (const line of b.body || []) {
    const src = slidePicture(line);
    if (src) {
      if (!cover) cover = src;
      const rest = trim(line.replace(DECK_IMAGE_RE, ""));
      if (rest) notes.push(rest);
    } else notes.push(line);
  }
  return {cover, notes: trim(notes.join("\n"))};
}
