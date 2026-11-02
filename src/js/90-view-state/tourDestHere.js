/* The tour destination you are standing in, if any -- the same reading of the
   view that tourNoteView() makes when it counts an arrival.

   This is what keeps the ask the right way round. Pressing a step marks it seen
   BEFORE the door opens, because the door may be a dialog that never comes
   back through go(); so the step is already "seen" by the time the screen it
   sends you to draws, and the ask would land on top of the feature you had not
   looked at yet -- tick this off, before you have seen the thing. A step you
   are inside is therefore never asked about. You are asked on the way out. */
function tourDestHere() {
  return tourOf(state.view, subNow());
}
