const holdWords = h => h === HOLD_OPEN ? "on hold, no date" : "on hold until " + humanDate(h);
const holdArrow = h => h === HOLD_OPEN ? "on hold, no date" : "on hold → " + humanDate(h);
