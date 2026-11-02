/* Until the alarm is clicked away, a click on the timer silences it and stops
   the count since it rang, instead of starting another one. */
let TIMER_RING = null;   // the gain the chime still rings through, if any
const timerRinging = () => !!(TIMER_RING || TIMER_FLASH || TIMER_DUE);
