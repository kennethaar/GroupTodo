/* A bell struck six times, loud: a fundamental and the inharmonic partials a
   real bell has, each dying away, alternating two notes so it reads as a
   chime rather than a beep. A compressor keeps the sum from clipping. */
/* One AudioContext for the page, made or woken by the click that starts the
   timer. A browser keeps a context made later, when the time is up and no
   one has clicked, suspended, and the alarm rang in silence. */
let TIMER_AUDIO = null;
