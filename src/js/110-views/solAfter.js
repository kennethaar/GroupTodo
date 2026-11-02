/* An answered field is a card that goes onto the pile under the project. A
   list you can pick several from stays out until you answer something else
   (or say it is done), so the second organisation is not a click away. */
function solAfter(r, field, hold = false) {
  if (SOL_EDIT) { SOL_EDIT.after(field); return; }
  SOL.focus = field;
  SOL.hold = hold ? field : null;
  SOL.step = null;
  // Everything this pass asks is answered: the card has had its turn.
  if (!hold && solSteps().every(f => f.filled(r))) { solPassDone(r); return; }
  render();
}
