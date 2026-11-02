/* A meeting with no date:: is on its day page, and there its time is the first
   thing on the line: a day is read by the clock. */
const clockHM = mins => pad2(Math.floor(mins / 60)) + ":" + pad2(mins % 60);
