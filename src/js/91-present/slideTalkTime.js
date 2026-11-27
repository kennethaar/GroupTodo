// The time since the talk started, as m:ss or h:mm:ss (#431, #485).
function slideTalkTime() {
  const t = Math.floor((Date.now() - DECK.t0) / 1000);
  const two = n => String(n).padStart(2, "0");
  return (t >= 3600 ? Math.floor(t / 3600) + ":" + two(Math.floor(t / 60) % 60) : Math.floor(t / 60)) + ":" + two(t % 60);
}
