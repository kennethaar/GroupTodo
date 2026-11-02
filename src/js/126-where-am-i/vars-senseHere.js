const senseHere = () => PREF.get("sense.here", "") || senseDefault(senseDevice());
const senseAway = () => PREF.get("sense.away", "") || senseDefault("away");

/* Work hours: the days, from and to, and where you are then. No context
   means no rule. Kept per device, so the PC can say @office and the phone
   say nothing. */
const SENSE_WORK = {ctx: "", days: [1, 2, 3, 4, 5], from: "08:00", to: "16:00"};
