function scheduleMeetPaint() {
  clearTimeout(MEET_PAINT);
  MEET_PAINT = setTimeout(() => { if (V.loaded) paintNextMeeting(); }, 400);
}
