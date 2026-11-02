const fmtClock = m => pad2(Math.floor(m / 60)) + ":" + pad2(m % 60);
const startClock = raw => trim(raw) ? trim(raw).replace(/,\s*$/, "") + ", " + nowClock() + " -" : nowClock() + " -";
