const setNextSide = side => {
  senseLearn("side", side);
  PREF.set("next.side", JSON.stringify({slot: choreSlot(), side}));
  render();
};
/* Next on a phone shows where you are: what you usually pick at a moment
   like this, else the sensed guess once Sense where I am is set up. Only a
   context with something to do in it, and "Show all" puts it away for the
   hour (and is learnt too). */
let NEXT_GUESS_OFF = "";
const hourKey = (now = new Date()) => isoOf(now) + "T" + now.getHours();
