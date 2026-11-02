/* A drag rings when it went up, or with Ctrl held whichever way it went;
   right or down is silent. */
const timerDragRings = (e, dx, dy) => e.ctrlKey || e.metaKey || (dy < 0 && -dy > Math.abs(dx));
const timerLeft = () => Math.max(0, TIMER_END - Date.now());
const clock = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
