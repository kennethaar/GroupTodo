async function senseCachePos() {
  if (Date.now() - SENSE_POS_AT < 5 * 60000) return;
  SENSE_POS_AT = Date.now();
  const p = await sensePosition(false);     // only once you have allowed it
  if (p) SENSE_POS = p;
}
