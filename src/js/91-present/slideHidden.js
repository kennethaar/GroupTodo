/* A line Present leaves out (#467), with the lines under it: a task line in
   any state, or a line that starts with "_ ". You plan the work and park a
   slide in the same outline as the talk. */
function slideHidden(b) {
  return !!b.state || /^_\s/.test(b.title || "");
}
