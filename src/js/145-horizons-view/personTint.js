/* A colour per person, stable, so the same face is the same colour everywhere. */
function personTint(name) {
  const key = slugPerson(name).toLowerCase();
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 360;
  return "hsl(" + h + " 55% 55%)";
}
