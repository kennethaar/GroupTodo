/* One that never finishes was a responsibility all along. Alt+I, or the page
   menu, asks which one: a new responsibility of its own name, or one that is
   already there -- the same name on top, then the ones whose names look
   alike, so "Health" and "Helth" or "Team" and "Team admin" end up as one. */
const areaWords = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .split(/[^a-z0-9æøå]+/).filter(Boolean);
