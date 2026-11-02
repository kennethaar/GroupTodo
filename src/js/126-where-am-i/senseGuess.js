async function senseGuess(ask) {
  const places = sensePlaces();
  const pos = places.length ? await sensePosition(ask) : null;
  if (pos) SENSE_POS = pos;
  const l = senseLearned("ctx");
  return guessContext({device: senseDevice(), net: senseNetwork(), pos,
    places, here: senseHere(), away: senseAway(), work: senseWork(), learned: l && l.v !== "*" ? l.v : null});
}
